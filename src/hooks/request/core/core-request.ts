import type { RequestOptions, RequestServiceFn } from '../types.ts'
import type useCoreState from './core-state.ts'
import type usePlugins from './plugins.ts'
import { isFunction } from 'es-toolkit'
import { ref } from 'vue'
import useDebounce from '../../debounce'
import useThrottle from '../../throttle'

export default function useCoreRequest<
  TData = any,
  TParams extends any[] = any[],
  TFormatData = TData,
>(
  {
    setState,
    rawState,
    data,
  }: ReturnType<typeof useCoreState<TData, TParams, TFormatData>>,
  service: RequestServiceFn<TData, TParams>,
  options: RequestOptions<TData, TParams, TFormatData> = {},
  runPluginHooks: ReturnType<typeof usePlugins<TData, TParams, TFormatData>>['runPluginHooks'],
) {
  const {
    ready = ref(true),
    debounceWait = 500,
    debounceMaxWait,
    debounceLeading = false,
    debounceTrailing = true,
    throttleWait = 500,
    throttleLeading = true,
    throttleTrailing = true,
    onBefore,
    onFinally,
    onError,
    onSuccess,
    onFinallyFetchDone,
    formatData,
  } = options

  let count = 0
  let isCancelled = false

  const coreRequest = async (...args: TParams): Promise<TFormatData | undefined> => {
    setTimeout(() => {
      onBefore?.(args)
    }, 0)
    const beforeReturn = runPluginHooks('onBefore', args)

    if (beforeReturn && beforeReturn.isReturned) {
      setState({ loading: false, finished: true })
      return
    }

    count += 1
    const currentCount = count

    setState({
      params: args,
      finished: false,
    })

    try {
      // service 直接返回 Promise<TData>，出错就 throw/reject
      const serviceWrapper = (...params: TParams): Promise<TData> => {
        return service(...params)
      }

      const { servicePromise } = runPluginHooks('onRequest', serviceWrapper, args)
      const result = await (servicePromise || serviceWrapper(...args))

      // 当连续请求的时候，最后一个服务请求完之后
      if (currentCount === count) {
        setState({ finished: true })
        onFinallyFetchDone?.(args)
        runPluginHooks('onFinallyFetchDone', args)
      }

      // 取消请求
      if (isCancelled) {
        if (currentCount === count)
          isCancelled = false
        return data.value
      }

      // 格式化数据
      const finalData = (formatData ? formatData(result, args) : result) as TFormatData

      setState({ data: finalData, error: undefined })
      onSuccess?.(finalData, args)
      runPluginHooks('onSuccess', finalData, args)

      return finalData
    }
    catch (e) {
      // service throw 或 reject 时落到这里
      if (isCancelled) {
        if (currentCount === count)
          isCancelled = false
        return data.value
      }

      setState({ error: e, finished: true })
      onError?.(e, args)
      runPluginHooks('onError', e, args)

      return Promise.reject(e)
    }
    finally {
      onFinally?.(args)
      runPluginHooks('onFinally', args)
    }
  }

  const run = async (...args: TParams) => {
    if (!ready.value)
      return
    return coreRequest(...args)
  }

  // 刷新
  const refresh = () => {
    return run(...rawState.params)
  }

  // 取消请求
  const cancel = () => {
    isCancelled = true
    setState({
      loading: false,
    })
    runPluginHooks('onCancel')
  }

  // 更改数据
  const mutate = (newData: TFormatData | ((oldData: TFormatData) => TFormatData)) => {
    const data = (isFunction(newData) ? newData(rawState.data as TFormatData) : newData) as TFormatData
    setState({ data })
    runPluginHooks('onMutate', data)
  }

  // 乐观更新
  const optimisticUpdate = (newData: TFormatData | ((oldData: TFormatData) => TFormatData), params: TParams = rawState.params) => {
    const oldData = rawState.data
    mutate(newData)
    run(...params).catch(() => {
      if (oldData !== undefined)
        mutate(oldData)
    })
  }

  // 防抖 run
  const debounceRun = useDebounce(run, debounceWait, {
    maxWait: debounceMaxWait,
    leading: debounceLeading,
    trailing: debounceTrailing,
  })

  // 节流 run
  const throttleRun = useThrottle(run, throttleWait, {
    leading: throttleLeading,
    trailing: throttleTrailing,
  })

  return { run, refresh, cancel, mutate, optimisticUpdate, debounceRun, throttleRun }
}

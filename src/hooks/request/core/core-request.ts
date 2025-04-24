import type { ResponseContent } from '../../../norm-axios/types.ts'
import type { RequestOptions, RequestServiceFn } from '../types.ts'
import type useCoreState from './core-state.ts'
import type usePlugins from './plugins.ts'
import { undefined } from '@rspack/core/compiled/zod'
import { isFunction } from 'es-toolkit'
import { ref } from 'vue'
import useDebounce from '../../debounce'
import useThrottle from '../../throttle'

export default function useCoreRequest<
  // 数据
  TData = any,
  // 方法参数
  TParams extends any[] = any[],
  // 格式化数据
  TFormatData = TData,
  // 原始数据
  TRawData = any,
>(
  {
    setState,
    rawState,
    data,
  }: ReturnType<typeof useCoreState<TData, TParams, TFormatData, TRawData>>,
  service: RequestServiceFn<TData, TParams, TRawData>,
  options: RequestOptions<TData, TParams, TFormatData, TRawData> = {},
  runPluginHooks: ReturnType<typeof usePlugins<TData, TParams, TFormatData, TRawData>>['runPluginHooks'],
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

    if (beforeReturn?.isReturned) {
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
      const serviceWrapper = (...params: TParams) => new Promise<ResponseContent<TData, TRawData>>(resolve => resolve(service(...params)))
      const { servicePromise } = runPluginHooks('onRequest', serviceWrapper, args)

      const content = await (servicePromise || serviceWrapper(...args))

      if (!(Array.isArray(content)))
        return Promise.reject(new TypeError('server 请返回正确的 ResponseContent 类型格式'))

      const [result, err, res] = content
      // 当连续请求的时候，最后一个服务请求完之后
      if (currentCount === count) {
        setState({ finished: true })
        onFinallyFetchDone?.(args)
        runPluginHooks('onFinallyFetchDone', args)
      }

      // 取消请求
      if (isCancelled) {
        if (currentCount === count) isCancelled = false
        return data.value
      }

      setState({
        response: res,
      })

      // 处理错误
      if (err) {
        setState({
          error: err,
        })
        onError?.(err, args, res!)
        runPluginHooks('onError', err, args, res!)
        return Promise.reject(err)
      }

      // 如果格式化数据函数存在就使用格式化后的数据，不存在就使用原数据
      const finalData = (formatData ? formatData(result, args, res!) : result) as TFormatData

      setState({ data: finalData, error: undefined })

      onSuccess?.(finalData, args, res!)
      runPluginHooks('onSuccess', finalData, args, res!)

      return finalData
    }
    catch (e) {
      return Promise.reject(e)
    }
    finally {
      onFinally?.(args)
      runPluginHooks('onFinally', args)
    }
  }

  const run = async (...args: TParams) => {
    if (!ready.value) return
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
    const data = (isFunction(newData) ? newData(rawState) : newData) as TFormatData
    setState({ data })
    runPluginHooks('onMutate', data)
  }

  // 乐观更新
  const optimisticUpdate = (newData: TFormatData | ((oldData: TFormatData) => TFormatData), params: TParams = rawState.params) => {
    const oldData = rawState.data
    mutate(newData)
    run(...params).catch(() => {
      if (oldData !== undefined) mutate(oldData)
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

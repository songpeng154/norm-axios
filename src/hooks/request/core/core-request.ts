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
  TSerialized = TData,
  TFormatData = TSerialized,
>(
  state: ReturnType<typeof useCoreState<TData, TParams, TSerialized, TFormatData>>,
  service: RequestServiceFn<TData, TParams>,
  options: RequestOptions<TData, TParams, TSerialized, TFormatData> = {},
  runPluginHooks: ReturnType<typeof usePlugins<TData, TParams, TSerialized, TFormatData>>['runPluginHooks'],
) {
  const { data, setState, rawState } = state
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
    throwOnError = false,
    dataSerializer,
    formatData,
  } = options

  let count = 0
  let cancelledCount = 0

  const serviceWrapper = (...params: TParams): Promise<TData> => service(...params)

  const coreRequest = async (...args: TParams): Promise<TFormatData | undefined> => {
    setTimeout(() => onBefore?.(args), 0)

    const beforeReturn = runPluginHooks('onBefore', args)
    if (beforeReturn?.isReturned) {
      setState({ loading: false, finished: true })
      return
    }

    const currentCount = ++count
    setState({ params: args, finished: false })

    try {
      const { servicePromise } = runPluginHooks('onRequest', serviceWrapper, args)
      const result = await (servicePromise || serviceWrapper(...args))

      if (currentCount === count) {
        setState({ finished: true })
        onFinallyFetchDone?.(args)
        runPluginHooks('onFinallyFetchDone', args)
      }

      if (currentCount <= cancelledCount)
        return data.value

      const extracted = (dataSerializer ? dataSerializer(result, args) : result) as TSerialized
      const finalData = (formatData ? formatData(extracted, result, args) : extracted) as TFormatData

      setState({ data: finalData, rawData: result, error: undefined })
      onSuccess?.(finalData, result, args)
      runPluginHooks('onSuccess', finalData, result, args)

      return finalData
    }
    catch (e) {
      if (currentCount <= cancelledCount)
        return data.value

      setState({ error: e, finished: true })
      onError?.(e, args)
      runPluginHooks('onError', e, args)

      if (throwOnError)
        return Promise.reject(e)

      return data.value
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

  const cancel = () => {
    cancelledCount = count
    setState({ loading: false })
    runPluginHooks('onCancel')
  }

  // 更改数据
  const mutate = (newData: TFormatData | ((oldData: TFormatData) => TFormatData)) => {
    const data = (isFunction(newData) ? newData(rawState.data as TFormatData) : newData) as TFormatData
    setState({ data })
    runPluginHooks('onMutate', data)
  }

  // 始终以 reject 方式运行，不受 throwOnError 影响
  const runForceReject = async (...args: TParams) => {
    await coreRequest(...args)
    if (rawState.error)
      throw rawState.error
  }

  // 乐观更新
  const optimisticUpdate = (newData: TFormatData | ((oldData: TFormatData) => TFormatData), params: TParams = rawState.params) => {
    const oldData = rawState.data
    mutate(newData)
    runForceReject(...params).catch(() => {
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

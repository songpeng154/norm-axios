import type { RequestOptions, RequestPluginHooks, RequestServiceFn } from '../types.ts'
import { isFunction } from 'es-toolkit'
import { nextTick, ref } from 'vue'
import useRequestState from './state.ts'

function useCoreRequest<
  // 数据
  TData = any,
  // 方法参数
  TParams extends any[] = any[],
  // 格式化数据
  TFormatData = TData,
  // 原始数据
  TRawData = any,
>(
  service: RequestServiceFn<TData, TParams, TRawData>,
  options: RequestOptions<TData, TParams, TFormatData, TRawData> = {},
) {
  type RequiredFetchPluginHoos = Required<RequestPluginHooks<TData, TParams, TFormatData, TRawData>>

  const {
    onBefore,
    onFinally,
    onError,
    onSuccess,
    formatData,
  } = options

  let count = 0
  let isCancelled = false
  let isStopExec = false

  const pluginHooks = ref<RequestPluginHooks<TData, TParams, TFormatData, TRawData>[]>([])

  const {
    data,
    rawData,
    response,
    params,
    error,
    loading,
    finished,
    rawState,
    setState,
  } = useRequestState<TData, TParams, TFormatData, TRawData>(options)

  const runPluginHooks = <K extends keyof RequiredFetchPluginHoos>(
    hook: K,
    ...args: Parameters<RequiredFetchPluginHoos[K]>
  ) => {
    for (const pluginHook of pluginHooks.value) {
      // @ts-expect-error ignore
      pluginHook[hook]?.(...args)
      if (isStopExec)
        break
    }
  }

  // 停止执行
  const stopExec = () => {
    isStopExec = true
  }

  // 核心请求
  const coreFetch = async (...args: TParams): Promise<TFormatData | undefined> => {
    /**
     * Tip 为什么使用 nextTick 包裹。
     * 是为了防止在 watchEffect 中使用的时候自动收集到 onBefore 中可能存在的依赖。
     * 为什么下边的 onSuccess 之类的不需要包裹，因为 watchEffect 会在其回调函数首次运行时自动收集所有在回调中访问的响应式变量作为依赖
     */
    void nextTick(() => {
      onBefore?.(args)
      runPluginHooks('onBefore', args, stopExec)
    })

    if (isStopExec) {
      isStopExec = false
      return
    }

    count += 1
    const currentCount = count

    setState({
      params: args,
      finished: false,
    })

    try {
      const content = await service(...args)

      if (!(Array.isArray(content))) {
        return Promise.reject(new TypeError('请 server 返回正确的 ResponseContent 类型格式'))
      }

      const [result, err, res] = content

      // 当连续请求的时候，最后一个服务请求完之后
      if (currentCount === count) {
        setState({ finished: true })
        runPluginHooks('onFinallyFetchDone')
      }

      // 取消请求
      if (isCancelled) {
        if (currentCount === count)
          isCancelled = false
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

      setState({ data: finalData })

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

  return {
    data,
    rawData,
    response,
    params,
    error,
    loading,
    finished,
    pluginHooks,
    rawState,
    setState,
    cancel,
    mutate,
    coreFetch,
  }
}

export default useCoreRequest

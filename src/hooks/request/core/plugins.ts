import type { RequestContext, RequestPluginHooks, RequestPluginImplement } from '../types.ts'
import { ref } from 'vue'

export default function usePlugins<
  // 数据
  TData = any,
  // 方法参数
  TParams extends any[] = any[],
  // 序列化数据
  TSerialized = TData,
  // 格式化数据
  TFormatData = TSerialized,
  // 错误
  TError = any,
>(plugins: RequestPluginImplement<TData, TParams, TSerialized, TFormatData, TError>[]) {
  type RequiredFetchPluginHoos = Required<RequestPluginHooks<TData, TParams, TSerialized, TFormatData, TError>>

  const pluginHooks = ref<RequestPluginHooks<TData, TParams, TSerialized, TFormatData, TError>[]>([])

  const register = (context: RequestContext<TData, TParams, TSerialized, TFormatData, TError>) => {
    pluginHooks.value = plugins.map(plugin => plugin(context)).filter(Boolean) as RequestPluginHooks<TData, TParams, TSerialized, TFormatData, TError>[]
  }

  const runPluginHooks = <K extends keyof RequiredFetchPluginHoos>(
    hook: K,
    ...args: Parameters<RequiredFetchPluginHoos[K]>
  ): ReturnType<RequiredFetchPluginHoos[K]> => {
    // @ts-expect-error ignore
    const result = pluginHooks.value.map(pluginHook => pluginHook[hook]?.(...args)).filter(Boolean)
    return Object.assign({}, ...result)
  }

  return { register, runPluginHooks }
}

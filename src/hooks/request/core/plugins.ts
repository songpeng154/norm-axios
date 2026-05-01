import type { RequestContext, RequestPluginHooks, RequestPluginImplement } from '../types.ts'
import { ref } from 'vue'

export default function usePlugins<
  // 数据
  TData = any,
  // 方法参数
  TParams extends any[] = any[],
  // 格式化数据
  TFormatData = TData,
>(plugins: RequestPluginImplement<TData, TParams, TFormatData>[]) {
  type RequiredFetchPluginHoos = Required<RequestPluginHooks<TData, TParams, TFormatData>>

  const pluginHooks = ref<RequestPluginHooks<TData, TParams, TFormatData>[]>([])

  const register = (context: RequestContext<TData, TParams, TFormatData>) => {
    pluginHooks.value = plugins.map(plugin => plugin(context)).filter(Boolean) as RequestPluginHooks<TData, TParams, TFormatData>[]
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

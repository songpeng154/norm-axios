import type { FetchContext, FetchOptions, FetchPluginImplement, FetchResult, FetchServiceFn } from './types.ts'
import { omit } from 'es-toolkit'
import { effectScope, inject, onScopeDispose, ref } from 'vue'
import useDebounce from '../debounce'
import { GLOBAL_PROVIDER_SYMBOL } from '../global'
import useThrottle from '../throttle'
import useCoreFetch from './core/fetch.ts'
import useAutoRunPlugin from './plugins/auto-run.ts'
import useErrorRetryPlugin from './plugins/error-retry.ts'
import useLoadingPlugin from './plugins/loading.ts'
import usePollingPlugin from './plugins/polling.ts'
import useRefreshOnWindowFocusPlugin from './plugins/window-focus.ts'

export function useFetch<
  // 数据
  TData = any,
  // 方法参数
  TParams extends any[] = any[],
  // 格式化数据
  TFormatData = TData,
  // 原始数据
  TRawData = any,
>(
  service: FetchServiceFn<TData, TParams, TRawData>,
  options: FetchOptions<TData, TParams, TFormatData, TRawData> = {},
  plugins: FetchPluginImplement<TData, TParams, TFormatData, TRawData>[] = [],
): FetchResult<TData, TParams, TFormatData, TRawData> {
  const globalProvider = inject(GLOBAL_PROVIDER_SYMBOL)

  const allPlugins = [
    ...plugins,
    useAutoRunPlugin,
    useLoadingPlugin,
    useRefreshOnWindowFocusPlugin,
    usePollingPlugin,
    useErrorRetryPlugin,
    ...(globalProvider?.plugins || []),
  ]

  const config: FetchOptions<TData, TParams, TFormatData, TRawData> = Object.assign(options, globalProvider?.common)

  const scope = effectScope()

  const {
    ready = ref(true),
    debounceWait = 500,
    debounceMaxWait,
    debounceLeading = false,
    debounceTrailing = true,
    throttleWait = 500,
    throttleLeading = true,
    throttleTrailing = true,
  } = config

  const fetchInstance = useCoreFetch<TData, TParams, TFormatData, TRawData>(
    service,
    config,
  )

  const run = async (...args: TParams) => {
    if (!ready.value) return
    return fetchInstance.coreFetch(...args)
  }

  // 刷新
  const refresh = () => {
    return run(...fetchInstance.rawState.params)
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

  const context: FetchContext<TData, TParams, TFormatData, TRawData> = {
    ...omit(fetchInstance, ['pluginHooks', 'coreFetch']),
    scope,
    options: config,
    run,
    refresh,
    debounceRun,
    throttleRun,
  }

  // @ts-expect-error 无法正确推断
  fetchInstance.pluginHooks.value = allPlugins.map(plugin => plugin(context)).filter(Boolean)

  onScopeDispose(() => {
    scope.stop()
  })

  return {
    ...omit(fetchInstance, ['pluginHooks', 'coreFetch', 'setState']),
    run,
    refresh,
    debounceRun,
    throttleRun,
  }
}

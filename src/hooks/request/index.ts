import type {
  RequestContext,
  RequestOptions,
  RequestPluginImplement,
  RequestResult,
  RequestServiceFn,
} from './types.ts'
import { isBoolean } from 'es-toolkit'
import { effectScope, inject, onScopeDispose, watch, watchEffect } from 'vue'
import { GLOBAL_CONFIG_PROVIDER_SYMBOL } from '../global'
import useCoreRequest from './core/core-request.ts'
import useCoreState from './core/core-state.ts'
import usePlugins from './core/plugins.ts'
import useCachePlugin from './plugins/cache.ts'
import useErrorRetryPlugin from './plugins/error-retry.ts'
import useLoadingPlugin from './plugins/loading.ts'
import usePollingPlugin from './plugins/polling.ts'
import useRefreshOnWindowFocusPlugin from './plugins/window-focus.ts'

export function useRequest<
  // 数据
  TData = any,
  // 方法参数
  TParams extends any[] = any[],
  // 格式化数据
  TFormatData = TData,
>(
  service: RequestServiceFn<TData, TParams>,
  options: RequestOptions<TData, TParams, TFormatData> = {},
  plugins: RequestPluginImplement<TData, TParams, TFormatData>[] = [],
): RequestResult<TData, TParams, TFormatData> {
  const scope = effectScope()

  const globalProvider = inject(GLOBAL_CONFIG_PROVIDER_SYMBOL, {})

  const allPlugins = [
    ...plugins,
    useCachePlugin,
    // useAutoRunPlugin,
    useLoadingPlugin,
    useRefreshOnWindowFocusPlugin,
    usePollingPlugin,
    useErrorRetryPlugin,
    ...(globalProvider?.plugins || []),
  ] as RequestPluginImplement<TData, TParams, TFormatData>[]

  const config = Object.assign(options, globalProvider?.common)

  const { register, runPluginHooks } = usePlugins<TData, TParams, TFormatData>(allPlugins)
  const coreState = useCoreState<TData, TParams, TFormatData>(config)
  const coreRequest = useCoreRequest<TData, TParams, TFormatData>(coreState, service, config, runPluginHooks)

  const context: RequestContext<TData, TParams, TFormatData> = {
    ...coreState,
    ...coreRequest,
    scope,
    options: config,
  }

  onScopeDispose(() => {
    scope.stop()
  })

  register(context)

  // 首次默认调用
  if (!config.manual && config.watchSource !== true)
    void coreRequest.run(...coreState.rawState.params).catch(() => {})

  scope.run(() => {
    // 依赖自动收集
    config.watchSource === true && watchEffect(() => {
      void coreRequest.run(...coreState.rawState.params).catch(() => {})
    })

    // 手动收集依赖
    !isBoolean(config.watchSource) && config.watchSource && watch(
      config.watchSource,
      () => {
        void coreRequest.run(...coreState.rawState.params).catch(() => {})
      },
      {
        deep: config.watchDeep,
      },
    )
  })

  return {
    ...coreState,
    ...coreRequest,
  }
}

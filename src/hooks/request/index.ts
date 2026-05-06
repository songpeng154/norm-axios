import type {
  RequestContext,
  RequestOptions,
  RequestPluginImplement,
  RequestResult,
  RequestServiceFn,
} from './types.ts'
import { isBoolean } from 'es-toolkit'
import { effectScope, onScopeDispose, watch, watchEffect } from 'vue'
import useCoreRequest from './core/core-request.ts'
import useCoreState from './core/core-state.ts'
import usePlugins from './core/plugins.ts'
import useCachePlugin from './plugins/cache.ts'
import useErrorRetryPlugin from './plugins/error-retry.ts'
import useLoadingPlugin from './plugins/loading.ts'
import usePollingPlugin from './plugins/polling.ts'
import useRefreshOnWindowFocusPlugin from './plugins/window-focus.ts'

export function useRequest<
  TData = any,
  TParams extends any[] = any[],
  TSerialized = TData,
  TFormatData = TSerialized,
  TError = any,
>(
  service: RequestServiceFn<TData, TParams>,
  options: RequestOptions<TData, TParams, TSerialized, TFormatData, TError> = {},
  plugins: RequestPluginImplement<TData, TParams, TSerialized, TFormatData, TError>[] = [],
): RequestResult<TData, TParams, TSerialized, TFormatData, TError> {
  const scope = effectScope()
  const allPlugins = [
    ...plugins,
    useCachePlugin,
    useLoadingPlugin,
    useRefreshOnWindowFocusPlugin,
    usePollingPlugin,
    useErrorRetryPlugin,
  ] as RequestPluginImplement<TData, TParams, TSerialized, TFormatData, TError>[]

  const { register, runPluginHooks } = usePlugins<TData, TParams, TSerialized, TFormatData, TError>(allPlugins)
  const coreState = useCoreState<TData, TParams, TSerialized, TFormatData, TError>(options)
  const coreRequest = useCoreRequest<TData, TParams, TSerialized, TFormatData, TError>(coreState, service, options, runPluginHooks)

  const context: RequestContext<TData, TParams, TSerialized, TFormatData, TError> = {
    ...coreState,
    ...coreRequest,
    scope,
    options,
  }

  onScopeDispose(() => scope.stop())
  register(context)

  const autoRun = () => coreRequest.run(...coreState.rawState.params)

  // 首次默认调用
  if (!options.manual && options.watchSource !== true)
    void autoRun()

  scope.run(() => {
    const { watchSource, watchDeep } = options

    // 依赖自动收集（manual 时跳过首次执行）
    if (watchSource === true) {
      let isFirstRun = true
      watchEffect(() => {
        if (options.manual && isFirstRun) {
          isFirstRun = false
          return
        }
        autoRun()
      })
    }

    // 手动收集依赖
    if (watchSource && !isBoolean(watchSource))
      watch(watchSource, autoRun, { deep: watchDeep })
  })

  return { ...coreState, ...coreRequest }
}

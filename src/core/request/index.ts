import type { Get } from 'type-fest'
import type { RequestOptions, RequestPluginImplement, RequestResult, RequestServiceFn } from '../../hooks'
import type { CreateRequestConfig } from './types.ts'
import { get } from 'es-toolkit/compat'
import { useRequest } from '../../hooks'

/**
 * 创建一个绑定了数据提取逻辑的 useRequest 工厂函数
 *
 * 通过配置 dataKey 指定数据字段路径（支持点号嵌套如 'data' 或 'result.data'），
 * TypeScript 会自动从 service 返回类型中推导出 data 的类型，无需手动标注泛型。
 *
 * **数据流：**
 * ```
 * service → TData → [dataSerializer] → TSerialized → [formatData] → TFormatData
 *                        ↑
 *                   自动提取（由 dataKey 配置）
 * ```
 *
 * **配置优先级：**
 * 局部 options > config.options > 全局配置
 *
 * @template TDataKey - dataKey 的字面量类型，用于自动推导 data 类型
 * @template TError - 错误类型，从 errorSerializer 的返回类型推断
 *
 * @param config - 工厂配置
 * @param config.dataKey - 数据字段路径，支持点号嵌套
 *   - `'data'` → 提取 `res.data`
 *   - `'result.data'` → 提取 `res.result.data`
 *   - 不设置时，data 等于 service 返回的原始数据
 * @param config.options - 全局选项，会被局部 options 覆盖
 *
 * @returns 返回一个绑定后的 useRequest 函数，签名如下：
 *   ```typescript
 *   (
 *     service: RequestServiceFn<TData, TParams>,
 *     options?: RequestOptions<TData, TParams, TSerialized, TFormatData, TError>,
 *     plugins?: RequestPluginImplement<TData, TParams, TSerialized, TFormatData, TError>[],
 *   ) => RequestResult<TData, TParams, TSerialized, TFormatData, TError>
 *   ```
 *
 * @example
 * // 基础用法 - 提取 res.data
 * const useApi = createRequest({ dataKey: 'data' })
 * const { data, loading } = useApi(getUserList)
 * // data.value → User（自动推导）
 *
 * @example
 * // 嵌套路径 - 提取 res.result.data
 * const useApi = createRequest({ dataKey: 'result.data' })
 * const { data } = useApi(getUserList)
 * // data.value → User[]
 *
 * @example
 * // 带全局选项
 * const useApi = createRequest({
 *   dataKey: 'data',
 *   options: {
 *     refreshOnWindowFocus: true,
 *     debounceWait: 300,
 *   }
 * })
 *
 * @example
 * // 使用插件
 * const useApi = createRequest({ dataKey: 'data' })
 * const { data } = useApi(service, {}, [myPlugin])
 *
 * @example
 * // 不设置 dataKey - data 等于原始返回值
 * const useApi = createRequest()
 * const { data } = useApi(service)
 * // data.value → ApiResponse（完整的响应对象）
 *
 * @example
 * // 配置错误类型
 * interface ApiError {
 *   code: number
 *   message: string
 * }
 * const useApi = createRequest<'data', ApiError>({
 *   dataKey: 'data',
 *   errorSerializer: (e) => ({
 *     code: e?.response?.status ?? -1,
 *     message: e?.message ?? String(e),
 *   })
 * })
 * const { error } = useApi(service)
 * // error.value → ApiError | undefined
 */
export function createRequest<TDataKey extends string = never, TError = any>(config: CreateRequestConfig<TDataKey, TError> = {}) {
  return <
    TData extends object,
    TParams extends any[] = any[],
    TSerialized = [TDataKey] extends [never] ? TData : Get<TData, TDataKey>,
    TFormatData = TSerialized,
  >(
    service: RequestServiceFn<TData, TParams>,
    options?: RequestOptions<TData, TParams, TSerialized, TFormatData, TError>,
    plugins: RequestPluginImplement<TData, TParams, TSerialized, TFormatData, TError>[] = [],
  ): RequestResult<TData, TParams, TSerialized, TFormatData, TError> => {
    const _options = {
      ...config.options,
      ...options,
    } as RequestOptions<TData, TParams, TSerialized, TFormatData, TError>

    if (config.dataKey && !_options.dataSerializer)
      _options.dataSerializer = (data: any) => get(data, config.dataKey as string)

    if (config.errorSerializer && !_options.errorSerializer)
      _options.errorSerializer = config.errorSerializer

    return useRequest<TData, TParams, TSerialized, TFormatData, TError>(service, _options, plugins)
  }
}

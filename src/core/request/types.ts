import type { RequestOptions, RequestPluginImplement } from '../../hooks'

export interface CreateRequestConfig<TDataKey extends string = string, TError = any> {
  /**
   * 数据字段路径，支持点号嵌套
   * TypeScript 会自动推导 data.value 的类型为 Get<TData, TDataKey>
   *
   * @example
   * dataKey: 'data'           // 提取 res.data
   * dataKey: 'result.data'    // 提取 res.result.data
   */
  dataKey?: TDataKey

  options?: Omit<RequestOptions, 'dataSerializer' | 'errorSerializer'>

  plugins?: RequestPluginImplement[]

  /**
   * 将捕获到的原始错误转换为自定义错误类型，作用于所有通过此工厂创建的请求
   * 可被局部 options.errorSerializer 覆盖
   *
   * @example
   * errorSerializer: (e) => ({
   *   code: e?.response?.status ?? -1,
   *   message: e?.message ?? String(e),
   * })
   */
  errorSerializer?: (error: unknown, params: any[]) => TError
}

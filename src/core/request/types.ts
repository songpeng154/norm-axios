import type { RequestOptions, RequestPluginImplement } from '../../hooks'

export interface CreateRequestConfig<TDataKey extends string = string> {
  /**
   * 数据字段路径，支持点号嵌套
   * TypeScript 会自动推导 data.value 的类型为 Get<TData, TDataKey>
   *
   * @example
   * dataKey: 'data'           // 提取 res.data
   * dataKey: 'result.data'    // 提取 res.result.data
   */
  dataKey?: TDataKey

  options?: RequestOptions

  plugins?: RequestPluginImplement[]
}

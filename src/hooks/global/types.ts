import type { FetchOptions, FetchPluginImplement } from '../fetch/types.ts'
import type { PaginationOptions } from '../pagination/types.ts'

export interface GlobalProvider<
  // 数据
  TData = any,
  // 方法参数
  TParams extends any[] = any[],
  // 格式化数据
  TFormatData = TData,
  // 原始数据
  TRawData = any,
> {
  /**
   * 通用配置
   */
  common: FetchOptions<TData, TParams, TFormatData, TRawData>

  /**
   * 分页配置
   */
  pagination?: PaginationOptions

  /**
   * 插件
   */
  plugins?: FetchPluginImplement<TData, TParams, TFormatData, TRawData>[]
}

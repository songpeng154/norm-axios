import type { PaginationOptions } from '../pagination/types.ts'
import type { RequestOptions, RequestPluginImplement } from '../request/types.ts'

export interface GlobalConfigProvider<
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
  common?: RequestOptions<TData, TParams, TFormatData, TRawData>

  /**
   * 分页配置
   */
  pagination?: PaginationOptions

  /**
   * 插件
   */
  plugins?: RequestPluginImplement<TData, TParams, TFormatData, TRawData>[]
}

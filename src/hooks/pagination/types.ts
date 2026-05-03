import type { ComputedRef, Ref } from 'vue'
import type { RequestOptions, RequestResult } from '../request/types.ts'

/**
 * 分页数据标准结构
 */
export interface PaginationData<TItem = any> {
  list: TItem[]
  total: number
}

/**
 * 分页配置
 */
export interface PaginationOptions<
  TData = any,
  TParams extends [Record<string, any>] = [Record<string, any>],
  TItem = any,
  TFormatData = TItem,
> extends Omit<
    RequestOptions<TData, TParams, PaginationData<TItem>, PaginationData<TFormatData>>,
    'dataSerializer' | 'formatData'
  > {
  /** 初始页码 */
  initialPage?: number

  /** 初始每页条数 */
  initialPageSize?: number

  /**
   * page 变化时是否自动刷新
   * 为 true 时会自动禁用 watchSource 的依赖自动收集（watchSource: true），
   * 避免 page/pageSize 变化时重复请求；显式传入 watchSource: Ref[] 仍会保留
   * @default true
   */
  pageWatch?: boolean

  /** pageSize 变化时是否重置 page @default true */
  resetPageWhenPageSizeChange?: boolean

  /** 分页参数序列化，用于适配后端不同的字段名 */
  paginationSerializer?: (page: number, pageSize: number) => Partial<TParams[0]>

  /** 从 server 返回数据中提取 list 和 total */
  dataSerializer: (data: TData, params: TParams) => PaginationData<TItem>

  /** 格式化列表项，total 保持不变 */
  formatList?: (list: TItem[], rawData: TData, params: TParams) => TFormatData[]
}

/**
 * 分页返回值
 */
export interface PaginationResult<
  TData = any,
  TParams extends [Record<string, any>] = [Record<string, any>],
  TItem = any,
  TFormatData = TItem,
> extends RequestResult<
    TData,
    TParams,
    PaginationData<TItem>,
    PaginationData<TFormatData>
  > {
  /** 当前列表数据 */
  list: ComputedRef<TFormatData[]>

  /** 当前页码（可写） */
  page: Ref<number>

  /** 每页条数（可写） */
  pageSize: Ref<number>

  /** 数据总条数 */
  total: ComputedRef<number>

  /** 总页数 */
  totalPage: ComputedRef<number>

  /** 是否已是最后一页 */
  isLastPage: ComputedRef<boolean>

  /** 重置到第一页 */
  reset: () => void
}

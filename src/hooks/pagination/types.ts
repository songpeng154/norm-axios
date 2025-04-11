import type { ComputedRef, MaybeRef, Ref, ShallowRef } from 'vue'
import type { ResponseContent } from '../../norm-axios/types.ts'
import type { RequestOptions, RequestResult } from '../request/types.ts'

export interface PaginationResponse<TResponse = any> {
  list: TResponse[]

  total: number
}

export type PaginationServiceFn<
  // 数据
  TData extends PaginationResponse = PaginationResponse,
  // 原始数据
  TRawData = any,
> = (pagination: { page: number, pageSize: number }) => Promise<ResponseContent<TData, TRawData>>

export interface PaginationOptions {
  /**
   * 父级容器，如果存在，则在滚动到底部时，分页自动+1,然后加载数据
   * 避免重复触发，请求期间不会触发滚动到底部的事件
   */
  target?: MaybeRef<HTMLElement> | ShallowRef<HTMLElement | null>

  /**
   * 加载更多偏移量
   * @default 100
   */
  loadMoreOffset?: number

  /**
   * 初始页码
   * @default 1
   */
  initialPage?: number

  /**
   * 初始每页数据条数
   * @default 10
   */
  initialPageSize?: number

  /**
   * 追加模式
   * 启用后会自动将新请求的数据追加到已有列表中，例如第一次请求返回 [1, 2, 3]，第二次返回 [4, 5, 6]，最终列表将合并为 [1, 2, 3, 4, 5, 6]。该功能常用于「加载更多」场景。
   * @default false
   */
  addedMode?: boolean

  /**
   * 当 page 变化的时候自动调用服务
   * 当 pageWatch 与 watchSource 同时设置为 true 后，page 或者 pageSize变化的时候会调用两遍服务，这个问题可以设置 pageWatch 或者 watchSource来解决
   * @default true
   */
  pageWatch?: boolean

  /**
   * 当 pageSize 变化的时候重置 page
   * @default true
   */
  resetPageWhenPageSizeChange?: boolean
}

export type PaginationAndFetchOptions<
  // 数据
  TData extends PaginationResponse = PaginationResponse,
  // 方法参数
  TParams extends any[] = any[],
  // 格式化数据
  TFormatData extends PaginationResponse = TData,
  // 原始数据
  TRawData = any,
> =
  PaginationOptions &
  RequestOptions<TData, TParams, TFormatData, TRawData>

export interface PaginationResult<
  // 数据
  TData extends PaginationResponse = PaginationResponse,
  // 方法参数
  TParams extends any[] = any[],
  // 格式化数据
  TFormatData extends PaginationResponse = TData,
  // 原始数据
  TRawData = any,
> extends RequestResult<TData, TParams, TFormatData, TRawData> {
  /**
   * 列表数据
   */
  list: ComputedRef<TFormatData['list']>

  /**
   * 当前分页
   * @default 1
   */
  page: Ref<number>

  /**
   * 分页数量
   * @default 10
   */
  pageSize: Ref<number>

  /**
   * 数据总数
   */
  total: ComputedRef<number>

  /**
   * 分页总数
   */
  totalPage: ComputedRef<number>

  /**
   * 是否是最后一页
   */
  isLastPage: ComputedRef<boolean>
}

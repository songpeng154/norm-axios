import type { ComputedRef, MaybeRef, Ref, ShallowRef } from 'vue'
import type { RequestOptions, RequestResult } from '../request/types.ts'

// ─── 分页专属配置（可用于全局，使用 any 以兼容任意数据结构）────────────────
export interface PaginationOptions {
  /**
   * 滚动加载的容器，设置后在容器滚动到底部时自动将 page + 1
   */
  scrollTarget?: MaybeRef<HTMLElement> | ShallowRef<HTMLElement | null>

  /**
   * 触发滚动加载的距底部距离阈值（px）
   * @default 100
   */
  scrollOffset?: number

  /**
   * 初始页码
   * @default 1
   */
  initialPage?: number

  /**
   * 初始每页条数
   * @default 10
   */
  initialPageSize?: number

  /**
   * 追加模式（「加载更多」场景）
   * 开启后每次新数据会追加到现有列表末尾，而不是替换
   * @default false
   */
  appendMode?: MaybeRef<boolean>

  /**
   * 当 pageSize 变化时是否重置 page 到第一页
   * @default true
   */
  resetOnPageSizeChange?: boolean

  /**
   * 自定义分页参数的序列化方式
   * 用于适配后端不同的字段名
   * 推荐在 useGlobalConfigProvider 中统一配置，无需每次传入
   * @default (page, pageSize) => ({ page, pageSize })
   * @example
   * // MyBatis-Plus 风格
   * paginationSerializer: (page, pageSize) => ({ current: page, size: pageSize })
   */
  paginationSerializer?: (page: number, pageSize: number) => Record<string, any>

  /**
   * 从 service 返回的数据中提取列表和总条数
   * 推荐在 useGlobalConfigProvider 中统一配置一次，无需每次传入
   *
   * @default (data) => ({ list: data?.list ?? [], total: data?.total ?? 0 })
   *
   * @example
   * // 在 App.vue 全局配置一次
   * useGlobalConfigProvider({
   *   pagination: {
   *     dataSerializer: (data) => ({ list: data.records, total: data.totalCount })
   *   }
   * })
   */
  dataSerializer?: (data: any) => { list: any[], total: number }
}

/**
 * usePagination 局部调用的完整配置
 * 在这里覆盖 dataSerializer 签名以提供精确的类型推导
 *
 * TData  — service resolve 的原始数据类型
 * TParams — service 的参数类型
 * TItem  — 列表项类型，从 dataSerializer 的返回值中自动推导
 */
export type PaginationAndFetchOptions<
  TData = any,
  TParams extends any[] = any[],
  TItem = any,
> = Omit<PaginationOptions, 'dataSerializer'> &
  Omit<RequestOptions<TData, TParams>, 'defaultParams' | 'formatData'> & {
    defaultParams?: TParams
    /**
     * 从 service 数据中提取 list 和 total
     * 局部配置时可精确推导 TItem 类型
     */
    dataSerializer?: (data: TData) => { list: TItem[], total: number }
  }

export interface PaginationResult<
  TData = any,
  TParams extends any[] = any[],
  TItem = any,
> extends Omit<RequestResult<TData, TParams>, 'run'> {
  /**
   * 手动触发分页请求（当 manual: true 时使用）
   * 自动注入当前 page/pageSize，返回 Promise 支持 await
   */
  run: () => Promise<void>

  /** 当前列表数据 */
  list: ComputedRef<TItem[]>

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

  /** 是否还有更多数据 */
  hasMore: ComputedRef<boolean>

  /** 加载下一页 */
  loadMore: () => void
}

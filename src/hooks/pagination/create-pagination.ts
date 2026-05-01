import type { PaginationAndFetchOptions, PaginationResult } from './types.ts'
import type { RequestServiceFn } from '../request/types.ts'
import { usePagination } from './index.ts'

/**
 * 创建一个绑定了提取逻辑的分页 hook
 *
 * 通过 listKey / totalKey 指定字段名，TypeScript 会在每次调用 usePage(service) 时
 * 从 service 的返回类型中自动推导出列表项类型，无需任何泛型标注。
 *
 * @example
 * // src/api/pagination.ts — 配置一次
 * export const usePage = createPagination({
 *   listKey: 'records',
 *   totalKey: 'totalCount',
 *   paginator: (page, size) => ({ current: page, size }),
 * })
 *
 * // 组件里 — 自动推导，无需泛型
 * const { list } = usePage(getUserList)   // list.value → User[]   ✅
 * const { list } = usePage(getPostList)   // list.value → Post[]   ✅
 */
export function createPagination<
  TListKey extends string = 'list',
  TTotalKey extends string = 'total',
>(config: {
  /**
   * 列表字段名，对应 service 返回数据中的列表字段
   * TypeScript 会自动推导 list.value 的类型为 TData[TListKey][number]
   * @default 'list'
   */
  listKey?: TListKey

  /**
   * 总条数字段名
   * @default 'total'
   */
  totalKey?: TTotalKey

  /**
   * 分页参数序列化方式
   * @example
   * paginator: (page, size) => ({ current: page, size })
   */
  paginator?: (page: number, size: number) => Record<string, any>
}) {
  const listKey = (config.listKey ?? 'list') as TListKey
  const totalKey = (config.totalKey ?? 'total') as TTotalKey

  /**
   * 已绑定提取逻辑的分页 hook
   * TData 从 service 推导，TItem = TData[TListKey][number] 自动展开
   */
  return function usePage<
    TData extends { [K in TListKey]: any[] } & { [K in TTotalKey]: number },
    TParams extends any[],
  >(
    service: RequestServiceFn<TData, TParams>,
    options?: Omit<
      PaginationAndFetchOptions<TData, TParams, TData[TListKey][number]>,
      'dataSerializer' | 'paginationSerializer'
    >,
  ): PaginationResult<TData, TParams, TData[TListKey][number]> {
    return usePagination<TData, TParams, TData[TListKey][number]>(service, {
      ...options,
      dataSerializer: (data: TData) => ({
        list: data[listKey],
        total: data[totalKey],
      }),
      paginationSerializer: config.paginator,
    })
  }
}

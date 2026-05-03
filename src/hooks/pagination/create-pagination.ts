import type { ArrayElement, Get } from 'type-fest'
import type { RequestServiceFn } from '../request/types.ts'
import type { PaginationOptions, PaginationResult } from './types.ts'
import { get } from 'es-toolkit/compat'
import { usePagination } from './index.ts'

export interface CreatePaginationConfig<
  TListKey extends string = string,
  TTotalKey extends string = string,
> {
  /**
   * 列表字段路径，支持点号嵌套
   * TypeScript 会自动推导 list.value 的类型为 ArrayElement<Get<TData, TListKey>>[]
   */
  listKey: TListKey

  /**
   * 总条数字段路径，支持点号嵌套
   */
  totalKey: TTotalKey

  /**
   * 分页参数序列化方式
   * @example
   * paginationSerializer: (page, size) => ({ current: page, size })
   */
  paginationSerializer?: (page: number, pageSize: number) => Record<string, any>

  /**
   * 全局默认配置，会被调用时的 options 覆盖
   */
  options?: Omit<PaginationOptions, 'dataSerializer'>
}

/**
 * 创建一个绑定了提取逻辑的分页 hook
 *
 * 通过 listKey / totalKey 指定字段路径（支持点号嵌套如 'data.list'），
 * TypeScript 会在每次调用 usePage(service) 时从 service 的返回类型中
 * 自动推导出列表项类型，无需任何泛型标注。
 *
 * @example
 * // 简单路径
 * export const usePage = createPagination({
 *   listKey: 'records',
 *   totalKey: 'totalCount',
 * })
 *
 * // 嵌套路径（通用响应体）
 * export const usePage = createPagination({
 *   listKey: 'data.list',
 *   totalKey: 'data.total',
 * })
 *
 * // 组件里 — 自动推导，无需泛型
 * const { list } = usePage(getUserList)   // list.value → User[]   ✅
 * const { list } = usePage(getPostList)   // list.value → Post[]   ✅
 */
export function createPagination<
  TListKey extends string,
  TTotalKey extends string,
>(config: CreatePaginationConfig<TListKey, TTotalKey>) {
  const listKey = config.listKey as string
  const totalKey = config.totalKey as string

  return function <
    TData extends object,
    TParams extends [Record<string, any>] = [Record<string, any>],
    TItem = ArrayElement<Get<TData, TListKey>>,
    TFormatData = TItem,
  >(
    service: RequestServiceFn<TData, TParams>,
    options?: Omit<PaginationOptions<TData, TParams, TItem, TFormatData>, 'dataSerializer'>,
  ): PaginationResult<TData, TParams, TItem, TFormatData> {
    return usePagination<TData, TParams, TItem, TFormatData>(service, {
      ...config.options,
      ...options,
      dataSerializer: (data: any) => ({
        list: get(data, listKey) ?? [],
        total: get(data, totalKey) ?? 0,
      }),
      paginationSerializer: config.paginationSerializer,
    } as PaginationOptions<TData, TParams, TItem, TFormatData>)
  }
}

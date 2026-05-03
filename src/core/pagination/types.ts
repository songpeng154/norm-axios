import type { PaginationOptions } from '../../hooks'

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

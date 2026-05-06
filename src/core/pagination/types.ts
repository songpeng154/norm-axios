import type { PaginationOptions } from '../../hooks'

export interface CreatePaginationConfig<
  TListKey extends string = string,
  TTotalKey extends string = string,
  TError = any,
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

  /**
   * 全局默认配置，会被调用时的 options 覆盖
   */
  options?: Omit<PaginationOptions, 'dataSerializer' | 'paginationSerializer' | 'errorSerializer'>
}

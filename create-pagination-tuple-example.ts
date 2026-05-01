/**
 * createPagination — 同时支持「对象」和「元组」两种 service 返回类型
 *
 * 用法：
 *   const usePage = createPagination({ listKey: 'records' })  // 对象模式
 *   const usePage = createPagination()                         // 元组模式（默认）
 *
 * TypeScript 会在每次 usePage(service) 时自动推导列表项类型。
 */

// ============================================================
// 1. 类型工具：自动判断 TData 是元组还是对象，并提取列表项 / 总数
// ============================================================

/**
 * 从 TData 中提取「列表项类型」
 *
 * - 元组 [TItem[], number] → TItem
 * - 对象 { [TListKey]: TItem[], [TTotalKey]: number } → TItem
 */
type ExtractItem<
  TData,
  TListKey extends string,
> = TData extends readonly [infer List, infer _Total, ...unknown[]]
  // ── 元组分支：取第一个元素的数组项 ──
  ? List extends (infer Item)[]
    ? Item
    : never
  // ── 对象分支：按 listKey 取数组项 ──
  : TData extends { [K in TListKey]: (infer Item)[] }
    ? Item
    : never

/**
 * 从 TData 中提取「总数类型」
 *
 * - 元组 [any[], number] → number
 * - 对象 { [TListKey]: any[], [TTotalKey]: number } → number
 */
type ExtractTotal<
  TData,
  TListKey extends string,
  TTotalKey extends string,
> = TData extends readonly [infer _List, infer Total, ...unknown[]]
  ? Total extends number ? Total : never
  : TData extends { [K in TTotalKey]: infer T }
    ? T extends number ? T : never
    : never

/**
 * 根据 TData 的形状自动生成 dataSerializer
 *
 * - 元组 → ([list, total]) => ({ list, total })
 * - 对象 → (data) => ({ list: data[listKey], total: data[totalKey] })
 */
type InferDataSerializer<TData, TListKey extends string, TTotalKey extends string> =
  TData extends readonly [infer List extends any[], infer Total extends number, ...unknown[]]
    ? (data: readonly [List, Total]) => { list: List; total: Total }
    : (data: TData) => { list: TData[TListKey & keyof TData]; total: TData[TTotalKey & keyof TData] }

// ============================================================
// 2. 配置类型
// ============================================================

interface PaginationConfig<
  TListKey extends string = 'list',
  TTotalKey extends string = 'total',
> {
  /** 列表字段名（对象模式），默认 'list' */
  listKey?: TListKey
  /** 总条数字段名（对象模式），默认 'total' */
  totalKey?: TTotalKey
  /** 分页参数序列化 */
  paginator?: (page: number, size: number) => Record<string, any>
}

// ============================================================
// 3. createPagination — 工厂函数
// ============================================================

// （省略运行时实现，这里只展示类型签名）
declare function createPagination<
  TListKey extends string = 'list',
  TTotalKey extends string = 'total',
>(config?: PaginationConfig<TListKey, TTotalKey>): {

  // usePage 的返回类型
  <TData, TParams extends any[]>(
    service: (...args: TParams) => Promise<TData>,
    options?: {
      defaultParams?: TParams
      manual?: boolean
      // ...
    },
  ): {
    list: ExtractItem<TData, TListKey>[]
    total: ExtractTotal<TData, TListKey, TTotalKey>
    page: number
    pageSize: number
    run: () => Promise<void>
    loadMore: () => void
    // ...
  }
}

// ============================================================
// 4. 使用示例
// ============================================================

// ── 示例 A：service 返回对象 ──────────────────────────
interface User { id: number; name: string }

async function getUserList(params: { current: number; size: number }): Promise<{
  records: User[]
  totalCount: number
}> {
  return { records: [], totalCount: 0 }
}

const usePageA = createPagination({ listKey: 'records', totalKey: 'totalCount' })
const pageA = usePageA(getUserList)
//    ^? list: User[]
//    ^? total: number
const _user: User = pageA.list[0]  // ✅ 推导正确

// ── 示例 B：service 返回元组 ──────────────────────────
interface Order { orderId: string; amount: number }

async function getOrderList(params: { page: number; pageSize: number }): Promise<[Order[], number]> {
  return [[], 0]
}

const usePageB = createPagination()
const pageB = usePageB(getOrderList)
//    ^? list: Order[]
//    ^? total: number
const _order: Order = pageB.list[0]  // ✅ 推导正确

// ── 示例 C：同一个 createPagination 用于多个不同 service ——
async function getProductList(): Promise<{ items: { sku: string }[]; total: number }> {
  return { items: [], total: 0 }
}

async function getCommentList(): Promise<[({ text: string })[], number]> {
  return [[], 0]
}

const usePageC = createPagination({ listKey: 'items' })
const pageC1 = usePageC(getProductList)   // list: { sku: string }[]
const pageC2 = usePageC(getCommentList)   // list: { text: string }[]

// ============================================================
// 5. 运行时 dataSerializer 也需要区分元组/对象
// ============================================================

/**
 * dataSerializer 的运行时实现也需要根据 shape 自动切换：
 *
 * 元组模式：
 *   dataSerializer: ([list, total]: [any[], number]) => ({ list, total })
 *
 * 对象模式：
 *   dataSerializer: (data) => ({ list: data[listKey], total: data[totalKey] })
 *
 * 这需要在 createPagination 的实现中，通过 isTupleService 标记来决定用哪个。
 * 可以用一个简单的运行时判断：检查 service 是否被标记为元组模式，
 * 或者在 config 里加一个 hidden flag。
 */

import { describe, expect, it } from 'vitest'
import { createPagination, usePagination } from '../../src'
import { asyncAwait, withSetup } from '../utils.ts'

describe('usePagination 核心测试', () => {
  interface UserItem {
    id: number
    name: string
  }

  // 模拟后端返回任意结构（不约束 list/total 字段名）
  interface ApiResponse {
    records: UserItem[]
    totalCount: number
  }

  const TOTAL_ITEMS = 25

  const mockService = async (params: { page: number, pageSize: number, keyword?: string }): Promise<ApiResponse> => {
    await asyncAwait(30)
    const { page, pageSize } = params
    const start = (page - 1) * pageSize
    const records: UserItem[] = []
    for (let i = start; i < Math.min(start + pageSize, TOTAL_ITEMS); i++) {
      records.push({ id: i + 1, name: `User ${i + 1}` })
    }
    return { records, totalCount: TOTAL_ITEMS }
  }

  const dataSerializer = (data: ApiResponse) => ({
    list: data.records,
    total: data.totalCount,
  })

  it('基础分页功能 (list / total / page 推导)', async () => {
    const [{ list, page, pageSize, total, totalPage, hasMore, isLastPage }] = withSetup(() =>
      usePagination(mockService, {
        dataSerializer,
        initialPage: 1,
        initialPageSize: 10,
      }),
    )

    await asyncAwait(100)
    expect(list.value).toHaveLength(10)
    expect(list.value[0]).toEqual({ id: 1, name: 'User 1' })
    expect(page.value).toBe(1)
    expect(pageSize.value).toBe(10)
    expect(total.value).toBe(25)
    expect(totalPage.value).toBe(3)
    expect(hasMore.value).toBe(true)
    expect(isLastPage.value).toBe(false)
  })

  it('分页参数变化触发重新请求', async () => {
    const [{ list, page, pageSize }] = withSetup(() =>
      usePagination(mockService, { dataSerializer }),
    )
    await asyncAwait(100)
    expect(list.value[0].id).toBe(1)

    page.value = 2
    await asyncAwait(100)
    expect(list.value[0].id).toBe(11)

    pageSize.value = 20
    await asyncAwait(100)
    expect(pageSize.value).toBe(20)
    expect(list.value).toHaveLength(20)
  })

  it('追加模式 (appendMode) 与 loadMore', async () => {
    const [{ list, page, loadMore, hasMore }] = withSetup(() =>
      usePagination(mockService, {
        dataSerializer,
        appendMode: true,
      }),
    )

    await asyncAwait(100)
    expect(list.value).toHaveLength(10)

    if (hasMore.value) loadMore()
    await asyncAwait(100)
    expect(page.value).toBe(2)
    expect(list.value).toHaveLength(20)
    expect(list.value[0].id).toBe(1)
    expect(list.value[10].id).toBe(11)
  })

  it('自定义分页参数序列化 (paginationSerializer)', async () => {
    let capturedParams: any = {}

    const customService = async (params: { current: number, size: number }): Promise<ApiResponse> => {
      capturedParams = params
      return { records: [], totalCount: 0 }
    }

    const [{ page, pageSize }] = withSetup(() =>
      usePagination(customService, {
        dataSerializer: () => ({ list: [], total: 0 }),
        paginationSerializer: (p, s) => ({ current: p, size: s }),
      }),
    )

    await asyncAwait(100)
    expect(capturedParams).toEqual({ current: 1, size: 10 })

    page.value = 2
    await asyncAwait(100)
    expect(capturedParams).toEqual({ current: 2, size: 10 })

    pageSize.value = 15
    await asyncAwait(100)
    expect(capturedParams).toEqual({ current: 1, size: 15 })
  })

  it('默认 dataSerializer 兼容 { list, total } 结构', async () => {
    interface DefaultResponse { list: UserItem[], total: number }
    const defaultService = async (params: { page: number, pageSize: number }): Promise<DefaultResponse> => {
      const start = (params.page - 1) * params.pageSize
      return {
        list: [{ id: start + 1, name: `User ${start + 1}` }],
        total: 5,
      }
    }

    const [{ list, total }] = withSetup(() => usePagination(defaultService))
    await asyncAwait(100)
    expect(list.value).toHaveLength(1)
    expect(total.value).toBe(5)
  })

  it('请求失败时 error 被正确设置', async () => {
    const failService = async (params: { page: number, pageSize: number }): Promise<ApiResponse> => {
      await asyncAwait(20)
      if (params.page > 1)
        throw new Error('Page not found')
      return { records: [{ id: 1, name: 'User 1' }], totalCount: 1 }
    }

    const [{ error, page }] = withSetup(() =>
      usePagination(failService, { dataSerializer }),
    )

    await asyncAwait(100)
    expect(error.value).toBeUndefined()

    page.value = 2
    await asyncAwait(100)
    expect(error.value).toBeInstanceOf(Error)
    expect((error.value as Error).message).toBe('Page not found')
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// createPagination 工厂测试
// ─────────────────────────────────────────────────────────────────────────────

describe('createPagination 工厂测试', () => {
  interface UserItem {
    id: number
    name: string
  }

  // 模拟后端结构：records / totalCount（非标准字段名）
  interface ApiResponse {
    records: UserItem[]
    totalCount: number
  }

  const TOTAL_ITEMS = 15

  const mockService = async (params: { current: number, size: number }): Promise<ApiResponse> => {
    await asyncAwait(30)
    const { current, size } = params
    const start = (current - 1) * size
    const records: UserItem[] = []
    for (let i = start; i < Math.min(start + size, TOTAL_ITEMS); i++) {
      records.push({ id: i + 1, name: `User ${i + 1}` })
    }
    return { records, totalCount: TOTAL_ITEMS }
  }

  // 一次配置，模拟放在 src/api/pagination.ts
  const usePage = createPagination({
    extract: (data: ApiResponse) => ({
      list: data.records,
      total: data.totalCount,
    }),
    paginator: (page, size) => ({ current: page, size }),
  })

  it('基础功能 — list 正确，类型与运行时一致', async () => {
    const [{ list, total, page, hasMore }] = withSetup(() => usePage(mockService))

    await asyncAwait(100)
    expect(list.value).toHaveLength(10)
    expect(list.value[0]).toEqual({ id: 1, name: 'User 1' })
    expect(total.value).toBe(15)
    expect(hasMore.value).toBe(true)
    expect(page.value).toBe(1)
  })

  it('翻页 — page 变化自动请求', async () => {
    const [{ list, page }] = withSetup(() => usePage(mockService))

    await asyncAwait(100)
    expect(list.value[0].id).toBe(1)

    page.value = 2
    await asyncAwait(100)
    expect(list.value[0].id).toBe(11)
  })

  it('paginator 被正确应用到请求参数', async () => {
    let captured: any = {}
    const captureService = async (params: { current: number, size: number }): Promise<ApiResponse> => {
      captured = params
      return { records: [], totalCount: 0 }
    }

    const [{ page }] = withSetup(() => usePage(captureService))

    await asyncAwait(100)
    // paginator 把 page/pageSize 转成了 current/size
    expect(captured).toMatchObject({ current: 1, size: 10 })

    page.value = 3
    await asyncAwait(100)
    expect(captured).toMatchObject({ current: 3, size: 10 })
  })

  it('局部 options 透传 (manual + defaultParams)', async () => {
    const [{ list, run }] = withSetup(() =>
      usePage(mockService, { manual: true }),
    )

    // manual: true → 初始不请求
    await asyncAwait(100)
    expect(list.value).toHaveLength(0)

    await run()
    expect(list.value).toHaveLength(10)
  })

  it('错误处理 — service throw 时 error 被设置', async () => {
    const failService = async (params: { current: number, size: number }): Promise<ApiResponse> => {
      if (params.current > 1)
        throw new Error('no more pages')
      return { records: [{ id: 1, name: 'u1' }], totalCount: 1 }
    }

    const [{ error, page }] = withSetup(() => usePage(failService))
    await asyncAwait(100)
    expect(error.value).toBeUndefined()

    page.value = 2
    await asyncAwait(100)
    expect(error.value).toBeInstanceOf(Error)
    expect((error.value as Error).message).toBe('no more pages')
  })
})

describe('createPagination 多场景类型适配与复杂结构测试', () => {
  interface User { id: number; username: string }
  interface Product { sku: string; price: number }
  interface Order { orderId: string; amount: number }

  // 场景 A：后端字段 records / total
  // listKey: 'records' → TItem = TData['records'][number] 在调用时自动推导
  const usePageA = createPagination({
    listKey: 'records',
    totalKey: 'total',
    paginator: (page, size) => ({ current: page, size }),
  })

  // 场景 B：后端字段 items / count
  const usePageB = createPagination({
    listKey: 'items',
    totalKey: 'count',
  })

  // 场景 C：默认字段 list / total（无需配置 listKey/totalKey）
  const usePageC = createPagination({})

  it('场景 A + User — list.value 类型为 User[]', async () => {
    const userService = async (): Promise<{ records: User[], total: number }> => ({
      records: [{ id: 1, username: 'alice' }, { id: 2, username: 'bob' }],
      total: 2,
    })
    const [{ list, total }] = withSetup(() => usePageA(userService))
    await asyncAwait(50)

    expect(list.value).toHaveLength(2)
    expect(list.value[0].username).toBe('alice')
    expect(total.value).toBe(2)

    // 编译期类型断言（vue-tsc 会验证）
    void (list.value satisfies User[])
    void (list.value[0].username satisfies string)
  })

  it('场景 A + Product — 同一工厂推导出 Product[]', async () => {
    const prodService = async (): Promise<{ records: Product[], total: number }> => ({
      records: [{ sku: 'SKU-001', price: 99 }],
      total: 1,
    })
    const [{ list }] = withSetup(() => usePageA(prodService))
    await asyncAwait(50)

    expect(list.value[0].sku).toBe('SKU-001')
    void (list.value satisfies Product[])
    void (list.value[0].price satisfies number)
  })

  it('同一工厂 usePageA — 不同 service 各自推导出不同类型', async () => {
    const userSrv = async (): Promise<{ records: User[], total: number }> =>
      ({ records: [{ id: 1, username: 'u' }], total: 1 })
    const prodSrv = async (): Promise<{ records: Product[], total: number }> =>
      ({ records: [{ sku: 'X', price: 10 }], total: 1 })

    const [{ list: users }] = withSetup(() => usePageA(userSrv))
    const [{ list: prods }] = withSetup(() => usePageA(prodSrv))
    await asyncAwait(50)

    void (users.value satisfies User[])
    void (prods.value satisfies Product[])
    expect(users.value[0].username).toBe('u')
    expect(prods.value[0].sku).toBe('X')
  })

  it('场景 B + Order — items/count 字段结构推导 Order[]', async () => {
    const orderService = async (): Promise<{ items: Order[], count: number }> => ({
      items: [{ orderId: 'ORD-1', amount: 500 }],
      count: 1,
    })
    const [{ list, total }] = withSetup(() => usePageB(orderService))
    await asyncAwait(50)

    expect(list.value[0].orderId).toBe('ORD-1')
    expect(total.value).toBe(1)
    void (list.value satisfies Order[])
    void (list.value[0].amount satisfies number)
  })

  it('场景 C — 默认 list/total 字段，零配置', async () => {
    const defaultSrv = async (): Promise<{ list: User[], total: number }> => ({
      list: [{ id: 1, username: 'default' }],
      total: 1,
    })
    const [{ list }] = withSetup(() => usePageC(defaultSrv))
    await asyncAwait(50)

    void (list.value satisfies User[])
    expect(list.value[0].username).toBe('default')
  })

  it('特殊结构 — 直接 usePagination + dataSerializer 局部适配', async () => {
    // 后端结构复杂或嵌套，工厂无法覆盖时，直接用 usePagination
    interface WeirdResponse { stuff: string[], amount: number }
    const weirdSrv = async (): Promise<WeirdResponse> => ({ stuff: ['hello', 'world'], amount: 2 })

    const [{ list }] = withSetup(() =>
      usePagination(weirdSrv, {
        dataSerializer: (data) => ({ list: data.stuff, total: data.amount }),
      }),
    )
    await asyncAwait(50)

    void (list.value satisfies string[])
    expect(list.value).toContain('hello')
  })
})


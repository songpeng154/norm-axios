import { describe, expect, it } from 'vitest'
import { usePagination } from '../../src/hooks'
import { asyncAwait, withSetup } from '../utils.ts'

interface UserItem { id: number, name: string }
interface ApiResponse { records: UserItem[], totalCount: number }

const TOTAL = 12

const mockService = async (params: { page: number, pageSize: number }): Promise<ApiResponse> => {
  await asyncAwait(30)
  const { page, pageSize } = params
  const start = (page - 1) * pageSize
  const records: UserItem[] = []
  for (let i = start; i < Math.min(start + pageSize, TOTAL); i++)
    records.push({ id: i + 1, name: `User ${i + 1}` })

  return { records, totalCount: TOTAL }
}

const dataSerializer = (data: ApiResponse) => ({
  list: data.records,
  total: data.totalCount,
})

describe('usePagination formatList', () => {
  it('对列表项做格式化，total 保持不变', async () => {
    const [{ list, total, run }] = withSetup(() =>
      usePagination(mockService, {
        dataSerializer,
        formatList: list => list.map(item => ({ ...item, name: item.name.toUpperCase() })),
      }),
    )

    run({ page: 1, pageSize: 10 })
    await asyncAwait(100)
    expect(list.value).toHaveLength(10)
    expect(list.value[0]).toEqual({ id: 1, name: 'USER 1' })
    expect(list.value[9]).toEqual({ id: 10, name: 'USER 10' })
    expect(total.value).toBe(12)
  })

  it('转换列表项类型', async () => {
    const [{ list, total, run }] = withSetup(() =>
      usePagination(mockService, {
        dataSerializer,
        initialPageSize: 5,
        formatList: list => list.map(item => ({ label: `${item.id}-${item.name}` })),
      }),
    )

    run({ page: 1, pageSize: 5 })
    await asyncAwait(100)
    expect(list.value).toHaveLength(5)
    expect(list.value[0]).toEqual({ label: '1-User 1' })
    expect(total.value).toBe(12)
  })

  it('过滤列表项', async () => {
    const [{ list, total, run }] = withSetup(() =>
      usePagination(mockService, {
        dataSerializer,
        formatList: list => list.filter(item => item.id > 5),
      }),
    )

    run({ page: 1, pageSize: 10 })
    await asyncAwait(100)
    expect(list.value).toHaveLength(5)
    expect(list.value[0].id).toBe(6)
    expect(total.value).toBe(12) // total 不受过滤影响
  })

  it('翻页后 formatList 仍然生效', async () => {
    const [{ list, page, run }] = withSetup(() =>
      usePagination(mockService, {
        dataSerializer,
        initialPageSize: 5,
        formatList: list => list.map(item => ({ ...item, name: item.name.toUpperCase() })),
      }),
    )

    run({ page: 1, pageSize: 5 })
    await asyncAwait(100)
    expect(list.value[0]).toEqual({ id: 1, name: 'USER 1' })

    page.value = 2
    await asyncAwait(100)
    expect(list.value[0]).toEqual({ id: 6, name: 'USER 6' })
  })

  it('不传 formatList 时列表保持原样', async () => {
    const [{ list, total, run }] = withSetup(() =>
      usePagination(mockService, {
        dataSerializer,
        initialPageSize: 5,
      }),
    )

    run({ page: 1, pageSize: 5 })
    await asyncAwait(100)
    expect(list.value).toHaveLength(5)
    expect(list.value[0]).toEqual({ id: 1, name: 'User 1' })
    expect(total.value).toBe(12)
  })

  it('formatList 抛错时 error 被正确设置', async () => {
    const [{ error, list, run }] = withSetup(() =>
      usePagination(mockService, {
        dataSerializer,
        formatList: (list) => {
          return list.map((item) => {
            if (item.id > 8) throw new Error('id too large')
            return item
          })
        },
        onError: () => {},
      }),
    )

    run({ page: 1, pageSize: 10 }).catch(() => {})
    await asyncAwait(100)
    expect(error.value).toBeInstanceOf(Error)
    expect((error.value as Error).message).toBe('id too large')
    expect(list.value).toHaveLength(0)
  })

  it('formatList 可以添加额外字段', async () => {
    const [{ list, run }] = withSetup(() =>
      usePagination(mockService, {
        dataSerializer,
        formatList: list => list.map(item => ({
          ...item,
          displayName: `[${item.id}] ${item.name}`,
        })),
      }),
    )

    run({ page: 1, pageSize: 3 })
    await asyncAwait(100)
    expect(list.value[0].displayName).toBe('[1] User 1')
    expect(list.value[2].displayName).toBe('[3] User 3')
  })

  it('formatList 接收到正确的 rawData 和 params', async () => {
    let capturedRawData: any = null
    let capturedParams: any = null

    const [{ run }] = withSetup(() =>
      usePagination(mockService, {
        dataSerializer,
        initialPageSize: 5,
        formatList: (list, rawData, params) => {
          capturedRawData = rawData
          capturedParams = params
          return list
        },
      }),
    )

    run({ page: 2, pageSize: 5 })
    await asyncAwait(100)
    expect(capturedRawData).toEqual({
      records: expect.any(Array),
      totalCount: 12,
    })
    // params 是数组形式
    expect(capturedParams).toEqual([{ page: 2, pageSize: 5 }])
  })

  it('空列表时 formatList 仍被调用', async () => {
    const emptyService = async (): Promise<ApiResponse> => ({
      records: [],
      totalCount: 0,
    })

    let formatCalled = false
    const [{ list, total, run }] = withSetup(() =>
      usePagination(emptyService, {
        dataSerializer,
        formatList: (list) => {
          formatCalled = true
          return list.map(item => ({ ...item, name: item.name.toUpperCase() }))
        },
      }),
    )

    run({ page: 1, pageSize: 10 })
    await asyncAwait(100)
    expect(formatCalled).toBe(true)
    expect(list.value).toHaveLength(0)
    expect(total.value).toBe(0)
  })

  it('formatList 与 paginationSerializer 配合', async () => {
    let capturedParams: any = null

    const service = async (params: { current: number, size: number }) => {
      capturedParams = params
      const start = (params.current - 1) * params.size
      const records: UserItem[] = []
      for (let i = start; i < Math.min(start + params.size, TOTAL); i++)
        records.push({ id: i + 1, name: `User ${i + 1}` })
      return { records, totalCount: TOTAL }
    }

    const [{ list, run }] = withSetup(() =>
      usePagination(service, {
        dataSerializer: (data: any) => ({ list: data.records, total: data.totalCount }),
        paginationSerializer: (p, s) => ({ current: p, size: s }),
        initialPageSize: 5,
        formatList: list => list.map(item => ({ ...item, name: item.name.toUpperCase() })),
      }),
    )

    run({ current: 1, size: 5 })
    await asyncAwait(100)
    expect(list.value).toHaveLength(5)
    expect(list.value[0]).toEqual({ id: 1, name: 'USER 1' })
    expect(capturedParams).toEqual({ current: 1, size: 5 })
  })
})

import { describe, expect, it } from 'vitest'
import { usePagination } from '../../src/hooks'
import { asyncAwait, withSetup } from '../utils.ts'

interface UserItem { id: number; name: string }
interface ApiResponse { records: UserItem[]; totalCount: number }

const TOTAL = 25

const mockService = async (params: { page: number; pageSize: number }): Promise<ApiResponse> => {
  await asyncAwait(30)
  const { page, pageSize } = params
  const start = (page - 1) * pageSize
  const records: UserItem[] = []
  for (let i = start; i < Math.min(start + pageSize, TOTAL); i++) {
    records.push({ id: i + 1, name: `User ${i + 1}` })
  }
  return { records, totalCount: TOTAL }
}

const dataSerializer = (data: ApiResponse) => ({
  list: data.records,
  total: data.totalCount,
})

describe('usePagination 翻页', () => {
  it('page 变化触发重新请求', async () => {
    const [{ list, page, run }] = withSetup(() =>
      usePagination(mockService, { dataSerializer }),
    )
    run({ page: 1, pageSize: 10 })
    await asyncAwait(100)
    expect(list.value[0].id).toBe(1)

    page.value = 2
    await asyncAwait(100)
    expect(list.value[0].id).toBe(11)
  })

  it('pageSize 变化触发重新请求', async () => {
    const [{ list, pageSize, run }] = withSetup(() =>
      usePagination(mockService, { dataSerializer }),
    )
    run({ page: 1, pageSize: 10 })
    await asyncAwait(100)
    expect(list.value[0].id).toBe(1)

    pageSize.value = 20
    await asyncAwait(100)
    expect(pageSize.value).toBe(20)
    expect(list.value).toHaveLength(20)
  })

  it('pageSize 变化时重置 page 到第一页', async () => {
    const [{ page, pageSize, run }] = withSetup(() =>
      usePagination(mockService, { dataSerializer }),
    )
    run({ page: 1, pageSize: 10 })
    await asyncAwait(100)

    page.value = 3
    await asyncAwait(100)
    expect(page.value).toBe(3)

    pageSize.value = 20
    await asyncAwait(100)
    expect(page.value).toBe(1)
  })
})

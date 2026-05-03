import { describe, expect, it } from 'vitest'
import { ref } from 'vue'
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

describe('usePagination pageWatch', () => {
  it('pageWatch: true 时 page 变化自动刷新', async () => {
    const [{ list, page, run }] = withSetup(() =>
      usePagination(mockService, { dataSerializer, pageWatch: true }),
    )

    run({ page: 1, pageSize: 10 })
    await asyncAwait(100)
    expect(list.value[0].id).toBe(1)

    page.value = 2
    await asyncAwait(100)
    expect(list.value[0].id).toBe(11)
  })

  it('pageWatch: false 时 page 变化不自动刷新', async () => {
    const [{ list, page, run }] = withSetup(() =>
      usePagination(mockService, { dataSerializer, pageWatch: false }),
    )

    run({ page: 1, pageSize: 10 })
    await asyncAwait(100)
    expect(list.value[0].id).toBe(1)

    page.value = 2
    await asyncAwait(100)
    // pageWatch 关闭，列表不会更新
    expect(list.value[0].id).toBe(1)
  })

  it('pageWatch: true + watchSource: true 不会重复请求', async () => {
    let callCount = 0

    const countingService = async (params: { page: number; pageSize: number }): Promise<ApiResponse> => {
      callCount++
      await asyncAwait(30)
      const { page, pageSize } = params
      const start = (page - 1) * pageSize
      const records: UserItem[] = []
      for (let i = start; i < Math.min(start + pageSize, TOTAL); i++) {
        records.push({ id: i + 1, name: `User ${i + 1}` })
      }
      return { records, totalCount: TOTAL }
    }

    const [{ page, run }] = withSetup(() =>
      usePagination(countingService, {
        dataSerializer,
        pageWatch: true,
        watchSource: true,
      }),
    )

    run({ page: 1, pageSize: 10 })
    await asyncAwait(100)
    expect(callCount).toBe(1)

    // page 变化应只触发一次请求（pageWatch），不重复（watchSource 被禁用）
    page.value = 2
    await asyncAwait(100)
    expect(callCount).toBe(2)
  })

  it('pageWatch: true + watchSource: [ref] 保留显式依赖监听', async () => {
    const keyword = ref('test')
    let callCount = 0

    const countingService = async (params: { page: number; pageSize: number; keyword?: string }): Promise<ApiResponse> => {
      callCount++
      await asyncAwait(30)
      const { page, pageSize } = params
      const start = (page - 1) * pageSize
      const records: UserItem[] = []
      for (let i = start; i < Math.min(start + pageSize, TOTAL); i++) {
        records.push({ id: i + 1, name: `User ${i + 1}` })
      }
      return { records, totalCount: TOTAL }
    }

    const [{ page, run }] = withSetup(() =>
      usePagination(countingService, {
        dataSerializer,
        pageWatch: true,
        watchSource: [keyword],
      }),
    )

    run({ page: 1, pageSize: 10, keyword: 'test' })
    await asyncAwait(100)
    expect(callCount).toBe(1)

    // keyword 变化触发 watchSource 重新请求
    keyword.value = 'new'
    await asyncAwait(100)
    expect(callCount).toBe(2)

    // page 变化触发 pageWatch 重新请求
    page.value = 2
    await asyncAwait(100)
    expect(callCount).toBe(3)
  })

  it('pageWatch: false + watchSource: true 保留自动收集依赖', async () => {
    let callCount = 0

    const countingService = async (params: { page: number; pageSize: number }): Promise<ApiResponse> => {
      callCount++
      await asyncAwait(30)
      const { page, pageSize } = params
      const start = (page - 1) * pageSize
      const records: UserItem[] = []
      for (let i = start; i < Math.min(start + pageSize, TOTAL); i++) {
        records.push({ id: i + 1, name: `User ${i + 1}` })
      }
      return { records, totalCount: TOTAL }
    }

    const [{ page, run }] = withSetup(() =>
      usePagination(countingService, {
        dataSerializer,
        pageWatch: false,
        watchSource: true,
      }),
    )

    run({ page: 1, pageSize: 10 })
    await asyncAwait(100)
    expect(callCount).toBe(1)

    // pageWatch: false 时 page 变化不触发
    page.value = 2
    await asyncAwait(100)
    expect(callCount).toBe(1)
  })
})

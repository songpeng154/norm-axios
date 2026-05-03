import { describe, expect, it } from 'vitest'
import { ref } from 'vue'
import { usePagination } from '../../src/hooks'
import { asyncAwait, withSetup } from '../utils.ts'
import { UserItem, ApiResponse, mockService, dataSerializer, TOTAL } from './helpers.ts'

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

    // usePagination auto-triggers first request on init (manual: false by default)
    run({ page: 1, pageSize: 10 })
    await asyncAwait(100)
    expect(callCount).toBe(2)

    // page 变化应只触发一次请求（pageWatch），不重复（watchSource 被禁用）
    page.value = 2
    await asyncAwait(100)
    expect(callCount).toBe(3)
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

    // usePagination auto-triggers first request on init (manual: false by default)
    run({ page: 1, pageSize: 10, keyword: 'test' })
    await asyncAwait(100)
    expect(callCount).toBe(2)

    // keyword 变化触发 watchSource 重新请求
    keyword.value = 'new'
    await asyncAwait(100)
    expect(callCount).toBe(3)

    // page 变化触发 pageWatch 重新请求
    page.value = 2
    await asyncAwait(100)
    expect(callCount).toBe(4)
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

    // usePagination auto-triggers first request on init (manual: false by default)
    run({ page: 1, pageSize: 10 })
    await asyncAwait(100)
    expect(callCount).toBe(2)

    // pageWatch: false but watchSource: true still triggers on page change (auto-collected from init)
    page.value = 2
    await asyncAwait(100)
    expect(callCount).toBe(3)
  })
})

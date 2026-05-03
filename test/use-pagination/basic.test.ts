import { describe, expect, it } from 'vitest'
import { usePagination } from '../../src/hooks'
import { asyncAwait, withSetup } from '../utils.ts'

interface UserItem { id: number, name: string }
interface ApiResponse { records: UserItem[], totalCount: number }

const TOTAL = 25

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

describe('usePagination 基础分页', () => {
  it('正确返回 list / total / page / pageSize', async () => {
    const [{ list, page, pageSize, total, totalPage, isLastPage, run }] = withSetup(() =>
      usePagination(mockService, {
        dataSerializer,
        initialPage: 1,
        initialPageSize: 10,
      }),
    )

    run({ page: 1, pageSize: 10 })
    await asyncAwait(100)
    expect(list.value).toHaveLength(10)
    expect(list.value[0]).toEqual({ id: 1, name: 'User 1' })
    expect(page.value).toBe(1)
    expect(pageSize.value).toBe(10)
    expect(total.value).toBe(25)
    expect(totalPage.value).toBe(3)
    expect(isLastPage.value).toBe(false)
  })

  it('默认兼容 { list, total } 结构', async () => {
    interface DefaultResponse { list: UserItem[], total: number }
    const defaultService = async (params: { page: number, pageSize: number }): Promise<DefaultResponse> => {
      const start = (params.page - 1) * params.pageSize
      return {
        list: [{ id: start + 1, name: `User ${start + 1}` }],
        total: 5,
      }
    }

    const [{ list, total, run }] = withSetup(() => usePagination(defaultService, {
      dataSerializer: data => ({ list: data.list, total: data.total }),
    }))
    run({ page: 1, pageSize: 10 })
    await asyncAwait(100)
    expect(list.value).toHaveLength(1)
    expect(total.value).toBe(5)
  })

  it('请求失败时 error 被正确设置', async () => {
    const failService = async (params: { page: number; pageSize: number }): Promise<ApiResponse> => {
      await asyncAwait(20)
      if (params.page > 1) throw new Error('Page not found')
      return { records: [{ id: 1, name: 'User 1' }], totalCount: 1 }
    }

    const [{ error, page, run }] = withSetup(() =>
      usePagination(failService, {
        dataSerializer,
        onError: () => {},
      }),
    )

    run({ page: 1, pageSize: 10 })
    await asyncAwait(100)
    expect(error.value).toBeUndefined()

    page.value = 2
    await asyncAwait(100)
    expect(error.value).toBeInstanceOf(Error)
    expect((error.value as Error).message).toBe('Page not found')
  })
})

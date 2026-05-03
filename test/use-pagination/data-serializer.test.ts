import { describe, expect, it } from 'vitest'
import { usePagination } from '../../src/hooks'
import { asyncAwait, withSetup } from '../utils.ts'

describe('usePagination dataSerializer', () => {
  it('自定义 dataSerializer 提取非标准字段', async () => {
    interface ApiResp { items: string[], count: number }
    const service = async (_params: { page: number, pageSize: number }): Promise<ApiResp> => ({
      items: ['a', 'b', 'c'],
      count: 3,
    })

    const [{ list, total, run }] = withSetup(() =>
      usePagination(service, {
        dataSerializer: data => ({ list: data.items, total: data.count }),
      }),
    )

    run({ page: 1, pageSize: 10 })
    await asyncAwait(100)
    expect(list.value).toEqual(['a', 'b', 'c'])
    expect(total.value).toBe(3)
  })

  it('dataSerializer 可以对列表项做转换', async () => {
    interface Raw { ids: number[], total: number }
    const service = async (_params: { page: number, pageSize: number }): Promise<Raw> => ({ ids: [1, 2, 3], total: 3 })

    const [{ list, run }] = withSetup(() =>
      usePagination(service, {
        dataSerializer: data => ({
          list: data.ids.map(id => ({ id, label: `Item ${id}` })),
          total: data.total,
        }),
      }),
    )

    run({ page: 1, pageSize: 10 })
    await asyncAwait(100)
    expect(list.value).toEqual([
      { id: 1, label: 'Item 1' },
      { id: 2, label: 'Item 2' },
      { id: 3, label: 'Item 3' },
    ])
  })
})

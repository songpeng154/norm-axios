import { describe, expect, it } from 'vitest'
import { usePagination } from '../../src/hooks'
import { asyncAwait, withSetup } from '../utils.ts'

interface UserItem { id: number, name: string }

describe('usePagination paginationSerializer', () => {
  it('自定义分页参数序列化 (current/size)', async () => {
    let capturedParams: any = {}

    const service = async (params: { current: number, size: number }) => {
      capturedParams = params
      return { list: [] as UserItem[], total: 0 }
    }

    const [{ page, pageSize, run }] = withSetup(() =>
      usePagination(service, {
        dataSerializer: () => ({ list: [], total: 0 }),
        paginationSerializer: (p, s) => ({ current: p, size: s }),
      }),
    )

    run({ current: 1, size: 10 })
    await asyncAwait(100)
    expect(capturedParams).toEqual({ current: 1, size: 10 })

    page.value = 2
    await asyncAwait(100)
    expect(capturedParams).toEqual({ current: 2, size: 10 })

    pageSize.value = 15
    await asyncAwait(100)
    expect(capturedParams).toEqual({ current: 1, size: 15 })
  })

  it('自定义分页参数序列化 (offset/limit)', async () => {
    let capturedParams: any = {}

    const service = async (params: { offset: number, limit: number }) => {
      capturedParams = params
      return { list: [] as UserItem[], total: 0 }
    }

    const [{ page, pageSize, run }] = withSetup(() =>
      usePagination(service, {
        dataSerializer: () => ({ list: [], total: 0 }),
        paginationSerializer: (p, s) => ({ offset: (p - 1) * s, limit: s }),
        initialPage: 1,
        initialPageSize: 10,
      }),
    )

    run({ offset: 0, limit: 10 })
    await asyncAwait(100)
    expect(capturedParams).toEqual({ offset: 0, limit: 10 })

    page.value = 3
    await asyncAwait(100)
    expect(capturedParams).toEqual({ offset: 20, limit: 10 })

    pageSize.value = 20
    await asyncAwait(100)
    expect(capturedParams).toEqual({ offset: 0, limit: 20 })
  })

  it('默认 paginationSerializer 使用 page/pageSize', async () => {
    let capturedParams: any = {}

    const service = async (params: { page: number, pageSize: number }) => {
      capturedParams = params
      return { list: [] as UserItem[], total: 0 }
    }

    const [{ page, run }] = withSetup(() =>
      usePagination(service, {
        dataSerializer: () => ({ list: [], total: 0 }),
      }),
    )

    run({ page: 1, pageSize: 10 })
    await asyncAwait(100)
    expect(capturedParams).toEqual({ page: 1, pageSize: 10 })

    page.value = 2
    await asyncAwait(100)
    expect(capturedParams).toEqual({ page: 2, pageSize: 10 })
  })

  it('paginationSerializer 与查询参数合并', async () => {
    let capturedParams: any = {}

    const service = async (params: { name: string, status: string, current: number, size: number }) => {
      capturedParams = params
      return { list: [] as UserItem[], total: 0 }
    }

    const [{ page, run }] = withSetup(() =>
      usePagination(service, {
        dataSerializer: () => ({ list: [], total: 0 }),
        paginationSerializer: (p, s) => ({ current: p, size: s }),
        defaultParams: [{ name: 'test', status: 'active', current: 1, size: 10 }],
      }),
    )

    run({ name: 'test', status: 'active', current: 1, size: 10 })
    await asyncAwait(100)
    expect(capturedParams).toEqual({ name: 'test', status: 'active', current: 1, size: 10 })

    page.value = 2
    await asyncAwait(100)
    expect(capturedParams).toEqual({ name: 'test', status: 'active', current: 2, size: 10 })
  })

  it('paginationSerializer 覆盖查询参数中的分页字段', async () => {
    let capturedParams: any = {}

    const service = async (params: { name: string, current: number, size: number }) => {
      capturedParams = params
      return { list: [] as UserItem[], total: 0 }
    }

    const [{ page, run }] = withSetup(() =>
      usePagination(service, {
        dataSerializer: () => ({ list: [], total: 0 }),
        paginationSerializer: (p, s) => ({ current: p, size: s }),
        defaultParams: [{ name: 'test', current: 99, size: 99 }],
      }),
    )

    run({ name: 'test', current: 1, size: 10 })
    await asyncAwait(100)
    expect(capturedParams).toEqual({ name: 'test', current: 1, size: 10 })

    page.value = 3
    await asyncAwait(100)
    expect(capturedParams).toEqual({ name: 'test', current: 3, size: 10 })
  })

  it('paginationSerializer 返回部分字段', async () => {
    let capturedParams: any = {}

    const service = async (params: { name: string, page: number, pageSize: number, sort?: string }) => {
      capturedParams = params
      return { list: [] as UserItem[], total: 0 }
    }

    const [{ page, run }] = withSetup(() =>
      usePagination(service, {
        dataSerializer: () => ({ list: [], total: 0 }),
        paginationSerializer: (p, s) => ({ page: p, pageSize: s }),
        defaultParams: [{ name: 'test', page: 1, pageSize: 10, sort: 'name' }],
      }),
    )

    run({ name: 'test', page: 1, pageSize: 10, sort: 'name' })
    await asyncAwait(100)
    expect(capturedParams).toEqual({ name: 'test', page: 1, pageSize: 10, sort: 'name' })

    page.value = 2
    await asyncAwait(100)
    expect(capturedParams).toEqual({ name: 'test', page: 2, pageSize: 10, sort: 'name' })
  })

  it('翻页时自动注入分页参数', async () => {
    const paramsList: any[] = []

    const service = async (params: { current: number, size: number }) => {
      paramsList.push(params)
      return { list: [] as UserItem[], total: 100 }
    }

    const [{ page, pageSize, run }] = withSetup(() =>
      usePagination(service, {
        dataSerializer: () => ({ list: [], total: 100 }),
        paginationSerializer: (p, s) => ({ current: p, size: s }),
      }),
    )

    run({ current: 1, size: 10 })
    await asyncAwait(100)
    expect(paramsList).toHaveLength(1)
    expect(paramsList[0]).toEqual({ current: 1, size: 10 })

    page.value = 2
    await asyncAwait(100)
    expect(paramsList).toHaveLength(2)
    expect(paramsList[1]).toEqual({ current: 2, size: 10 })

    pageSize.value = 20
    await asyncAwait(100)
    expect(paramsList).toHaveLength(3)
    expect(paramsList[2]).toEqual({ current: 1, size: 20 })
  })
})

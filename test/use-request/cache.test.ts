import { describe, expect, it } from 'vitest'
import { clearCache, useRequest } from '../../src'
import { asyncAwait, withSetup } from '../utils.ts'

describe('useRequest -> cache 模块测试', () => {
  it('数据同步与缓存命中 (SWR)', async () => {
    let callCount = 0
    const mockService = async (id: number): Promise<string> => {
      callCount++
      await asyncAwait(50)
      return `Data ${id}`
    }

    const [{ data: data1 }] = withSetup(() =>
      useRequest(mockService, {
        defaultParams: [1],
        cacheKey: 'test-sync-key',
        staleTime: 200,
      }),
    )

    await asyncAwait(100)
    expect(callCount).toBe(1)
    expect(data1.value).toBe('Data 1')

    // 再次发一个相同 cacheKey 的请求
    const [{ data: data2, loading }] = withSetup(() =>
      useRequest(mockService, {
        defaultParams: [1],
        cacheKey: 'test-sync-key',
        staleTime: 200,
      }),
    )

    // 因为有了缓存，data 会立刻被赋予上一次的值
    expect(data2.value).toBe('Data 1')
    expect(callCount).toBe(1)

    // 在 staleTime 内认为是新鲜的，不会再发出请求
    await asyncAwait(100)
    expect(callCount).toBe(1)
    expect(loading.value).toBe(false)
  })

  it('相同 cacheKey 并发请求共享 Promise', async () => {
    let callCount = 0
    const mockService = async (): Promise<string> => {
      callCount++
      await asyncAwait(50)
      return 'Result'
    }

    const [{ data: data1 }] = withSetup(() =>
      useRequest(mockService, { cacheKey: 'test-concurrent-key' }),
    )

    const [{ data: data2 }] = withSetup(() =>
      useRequest(mockService, { cacheKey: 'test-concurrent-key' }),
    )

    await asyncAwait(100)

    expect(data1.value).toBe('Result')
    expect(data2.value).toBe('Result')
    // 两个实例，但底层只发一次请求
    expect(callCount).toBe(1)
  })

  it('使用 clearCache 清除缓存后会重新请求', async () => {
    let callCount = 0
    const mockService = async (): Promise<string> => {
      callCount++
      await asyncAwait(50)
      return 'Result'
    }

    const [{ data: data1 }] = withSetup(() =>
      useRequest(mockService, { cacheKey: 'test-clear-key', staleTime: 1000 }),
    )
    await asyncAwait(100)
    expect(callCount).toBe(1)
    expect(data1.value).toBe('Result')

    // 清除该缓存
    clearCache('test-clear-key')

    const [{ data: data2 }] = withSetup(() =>
      useRequest(mockService, { cacheKey: 'test-clear-key', staleTime: 1000 }),
    )

    // 缓存已清除，初始应该是 undefined
    expect(data2.value).toBeUndefined()

    await asyncAwait(100)
    expect(callCount).toBe(2)
    expect(data2.value).toBe('Result')
  })

  it('多实例数据共享与更新同步', async () => {
    let callCount = 0
    const mockService = async (val: string): Promise<string> => {
      callCount++
      await asyncAwait(50)
      return val
    }

    const [{ data: data1, run }] = withSetup(() =>
      useRequest(mockService, { cacheKey: 'test-sync-update-key', manual: true }),
    )

    await run('Apple')
    expect(data1.value).toBe('Apple')
    expect(callCount).toBe(1)

    // 第二个实例从缓存直接读取
    const [{ data: data2 }] = withSetup(() =>
      useRequest(mockService, { cacheKey: 'test-sync-update-key' }),
    )
    expect(data2.value).toBe('Apple')
  })

  it('缓存错误后不缓存结果', async () => {
    let callCount = 0
    const mockService = async (): Promise<string> => {
      callCount++
      if (callCount === 1)
        throw new Error('first call failed')
      return 'Success'
    }

    const [{ data, error, run }] = withSetup(() =>
      useRequest(mockService, { cacheKey: 'test-error-no-cache', manual: true }),
    )

    await run().catch(() => {})
    expect(error.value).toBeInstanceOf(Error)
    expect(data.value).toBeUndefined()

    // 第二次应该重新请求（不会使用错误的缓存）
    await run()
    expect(data.value).toBe('Success')
    expect(callCount).toBe(2)
  })
})

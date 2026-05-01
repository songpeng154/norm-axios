import { describe, expect, it } from 'vitest'
import { useRequest } from '../../src'
import { asyncAwait, withSetup } from '../utils.ts'

describe('useRequest 核心与类型测试', () => {
  interface User {
    id: number
    name: string
  }

  // service 直接 resolve 数据，出错就 throw
  const mockService = async (id: number, name: string): Promise<User> => {
    await asyncAwait(30)
    if (id < 0)
      throw new Error('Invalid ID')
    return { id, name }
  }

  it('TS 类型推导与基础功能', async () => {
    const [{ data, loading, run, mutate }] = withSetup(() =>
      useRequest(mockService, { manual: true }),
    )

    // 1. 初始状态
    expect(loading.value).toBe(false)
    expect(data.value).toBeUndefined()

    // 2. 执行请求
    const promise = run(1, 'Alice')
    expect(loading.value).toBe(true)

    const result = await promise
    expect(loading.value).toBe(false)
    expect(result).toEqual({ id: 1, name: 'Alice' })
    expect(data.value).toEqual({ id: 1, name: 'Alice' })

    // 3. mutate 修改数据
    mutate({ id: 2, name: 'Bob' })
    expect(data.value).toEqual({ id: 2, name: 'Bob' })

    mutate(old => old ? { ...old, name: 'Charlie' } : old as any)
    expect(data.value).toEqual({ id: 2, name: 'Charlie' })
  })

  it('错误处理 (Error Handling)', async () => {
    const [{ data, error, run }] = withSetup(() => useRequest(mockService, { manual: true }))

    await run(-1, 'Error').catch(() => {})

    expect(data.value).toBeUndefined()
    expect(error.value).toBeInstanceOf(Error)
    expect((error.value as Error)?.message).toBe('Invalid ID')
  })

  it('默认参数 (defaultParams)', async () => {
    const [{ data }] = withSetup(() => useRequest(mockService, { defaultParams: [100, 'DefaultUser'] }))

    await asyncAwait(100)
    expect(data.value).toEqual({ id: 100, name: 'DefaultUser' })
  })

  it('格式化数据 (formatData)', async () => {
    interface RawData { code: number; result: { id: number; name: string } }
    const rawService = async (id: number): Promise<RawData> => {
      return { code: 200, result: { id, name: `Name-${id}` } }
    }

    const [{ data, run }] = withSetup(() =>
      useRequest(rawService, {
        manual: true,
        formatData: res => res.result,
      }),
    )

    await run(10)
    expect(data.value).toEqual({ id: 10, name: 'Name-10' })
  })

  it('依赖收集 (watchSource)', async () => {
    let callCount = 0
    const { ref } = await import('vue')
    const keyword = ref('apple')
    const watchService = async (): Promise<string> => {
      callCount++
      await asyncAwait(10)
      return keyword.value
    }

    const [{ data }] = withSetup(() =>
      useRequest(watchService, {
        watchSource: [keyword],
      }),
    )

    // 初始化调用一次
    await asyncAwait(100)
    expect(callCount).toBe(1)
    expect(data.value).toBe('apple')

    // 连续修改
    keyword.value = 'banana'
    await asyncAwait(10)
    keyword.value = 'grape'

    await asyncAwait(100)
    expect(data.value).toBe('grape')
  })

  it('onSuccess / onError 生命周期', async () => {
    const successCalls: any[] = []
    const errorCalls: any[] = []

    const [{ run }] = withSetup(() =>
      useRequest(mockService, {
        manual: true,
        onSuccess: (data, params) => successCalls.push({ data, params }),
        onError: (error, params) => errorCalls.push({ error, params }),
      }),
    )

    await run(1, 'Alice')
    expect(successCalls).toHaveLength(1)
    expect(successCalls[0].data).toEqual({ id: 1, name: 'Alice' })

    await run(-1, 'Error').catch(() => {})
    expect(errorCalls).toHaveLength(1)
    expect(errorCalls[0].error).toBeInstanceOf(Error)
  })
})

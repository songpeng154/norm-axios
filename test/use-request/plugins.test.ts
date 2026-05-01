import { describe, expect, it } from 'vitest'
import { useRequest } from '../../src'
import { asyncAwait, withSetup } from '../utils.ts'
import { ref } from 'vue'

describe('useRequest 插件与高级特性测试', () => {
  it('生命周期钩子 (Lifecycle Hooks)', async () => {
    let beforeCount = 0
    let successCount = 0
    let errorCount = 0
    let finallyCount = 0

    const mockService = async (id: number) => {
      await asyncAwait(30)
      if (id < 0)
        throw new Error('Failed')
      return { id }
    }

    const [{ run }] = withSetup(() =>
      useRequest(mockService, {
        manual: true,
        onBefore: () => { beforeCount++ },
        onSuccess: () => { successCount++ },
        onError: () => { errorCount++ },
        onFinally: () => { finallyCount++ },
      }),
    )

    // 成功请求
    await run(1)
    expect(beforeCount).toBe(1)
    expect(successCount).toBe(1)
    expect(errorCount).toBe(0)
    expect(finallyCount).toBe(1)

    // 失败请求
    await run(-1).catch(() => {})
    expect(beforeCount).toBe(2)
    expect(successCount).toBe(1)
    expect(errorCount).toBe(1)
    expect(finallyCount).toBe(2)
  })

  it('错误重试 (Error Retry)', async () => {
    let callCount = 0
    const mockService = async () => {
      callCount++
      await asyncAwait(20)
      throw new Error('Always fails')
    }

    const [{ error, loading, run }] = withSetup(() =>
      useRequest(mockService, {
        manual: true,
        errorRetryCount: 3,
        errorRetryInterval: 50,
      }),
    )

    // 等待所有重试完成 (首次调用 + 3次重试 = 4次)
    void run().catch(() => {})
    await asyncAwait(300)

    expect(callCount).toBe(4)
    expect(error.value).toBeInstanceOf(Error)
    expect(loading.value).toBe(false)
  })

  it('轮询 (Polling)', async () => {
    let callCount = 0
    const mockService = async () => {
      callCount++
      await asyncAwait(10)
      return { count: callCount }
    }

    const [{ data, cancel }] = withSetup(() =>
      useRequest(mockService, {
        pollingInterval: 100,
      }),
    )

    await asyncAwait(50)
    expect(callCount).toBe(1)
    expect(data.value).toEqual({ count: 1 })

    await asyncAwait(100)
    expect(callCount).toBe(2)
    expect(data.value).toEqual({ count: 2 })

    cancel()
    await asyncAwait(150)
    expect(callCount).toBe(2)
  })

  it('防抖 (Debounce)', async () => {
    let callCount = 0
    const mockService = async (val: string): Promise<string> => {
      callCount++
      await asyncAwait(10)
      return val
    }

    const [{ debounceRun, data }] = withSetup(() =>
      useRequest(mockService, {
        manual: true,
        debounceWait: 100,
      }),
    )

    void debounceRun('a')
    void debounceRun('b')
    void debounceRun('c')

    await asyncAwait(150)

    expect(callCount).toBe(1)
    expect(data.value).toBe('c')
  })

  it('节流 (Throttle)', async () => {
    let callCount = 0
    const mockService = async (val: string): Promise<string> => {
      callCount++
      await asyncAwait(10)
      return val
    }

    const [{ throttleRun }] = withSetup(() =>
      useRequest(mockService, {
        manual: true,
        throttleWait: 100,
      }),
    )

    void throttleRun('a')
    void throttleRun('b')
    void throttleRun('c')

    await asyncAwait(150)

    expect(callCount).toBeLessThanOrEqual(2)
  })

  it('依赖变化触发 (watchSource)', async () => {
    let callCount = 0
    const dep = ref(0)
    const mockService = async (): Promise<number> => {
      callCount++
      await asyncAwait(10)
      return dep.value
    }

    const [{ data }] = withSetup(() =>
      useRequest(mockService, {
        watchSource: [dep],
      }),
    )

    await asyncAwait(50)
    expect(callCount).toBe(1)

    dep.value = 1
    await asyncAwait(50)

    expect(callCount).toBe(2)
    expect(data.value).toBe(1)
  })
})

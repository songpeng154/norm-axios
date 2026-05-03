import { describe, expect, it } from 'vitest'
import { useRequest } from '../../src/hooks'
import { asyncAwait, withSetup } from '../utils.ts'

describe('useRequest 生命周期回调', () => {
  it('onSuccess 在请求成功时触发', async () => {
    let result: any = null
    const service = async () => {
      await asyncAwait(20)
      return 'ok'
    }

    withSetup(() =>
      useRequest(service, {
        onSuccess(data) {
          result = data
        },
      }),
    )

    await asyncAwait(100)
    expect(result).toBe('ok')
  })

  it('onError 在请求失败时触发', async () => {
    let err: any = null
    const service = async () => {
      await asyncAwait(20)
      throw new Error('fail')
    }

    withSetup(() =>
      useRequest(service, {
        onError(error) {
          err = error
        },
      }),
    )

    await asyncAwait(100)
    expect(err).toBeInstanceOf(Error)
    expect(err.message).toBe('fail')
  })

  it('onBefore 在请求前触发', async () => {
    let beforeCalled = false
    let successCalled = false
    const service = async () => {
      await asyncAwait(30)
      expect(beforeCalled).toBe(true)
      return 'ok'
    }

    withSetup(() =>
      useRequest(service, {
        onBefore() {
          beforeCalled = true
        },
        onSuccess() {
          successCalled = true
        },
      }),
    )

    await asyncAwait(100)
    expect(beforeCalled).toBe(true)
    expect(successCalled).toBe(true)
  })

  it('onFinally 在成功和失败时都会触发', async () => {
    let finallyCount = 0
    const service = async () => {
      await asyncAwait(20)
      return 'ok'
    }

    withSetup(() =>
      useRequest(service, {
        onFinally() {
          finallyCount++
        },
      }),
    )

    await asyncAwait(100)
    expect(finallyCount).toBe(1)
  })

  it('onSuccess 接收到 formatData 处理后的数据', async () => {
    let result: any = null
    const service = async () => {
      await asyncAwait(20)
      return { code: 0, data: 'hello' }
    }

    withSetup(() =>
      useRequest(service, {
        formatData: res => res.data,
        onSuccess(data) {
          result = data
        },
      }),
    )

    await asyncAwait(100)
    expect(result).toBe('hello')
  })
})

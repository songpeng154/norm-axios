import { describe, expect, it } from 'vitest'
import { useRequest } from '../../src/hooks'
import { asyncAwait, withSetup } from '../utils.ts'

describe('useRequest 错误重试', () => {
  it('errorRetryCount 指定重试次数', async () => {
    let callCount = 0
    const service = async () => {
      callCount++
      await asyncAwait(20)
      if (callCount <= 2) throw new Error('fail')
      return 'ok'
    }

    const [{ data, error }] = withSetup(() =>
      useRequest(service, {
        errorRetryCount: 3,
        errorRetryInterval: 10,
      }),
    )

    await asyncAwait(300)
    expect(callCount).toBe(3)
    expect(data.value).toBe('ok')
    expect(error.value).toBeUndefined()
  })

  it('超过重试次数后 error 被设置', async () => {
    let callCount = 0
    const service = async () => {
      callCount++
      await asyncAwait(20)
      throw new Error('always fail')
    }

    const [{ error }] = withSetup(() =>
      useRequest(service, {
        errorRetryCount: 2,
        errorRetryInterval: 10,
      }),
    )

    await asyncAwait(300)
    // 初始 1 次 + 重试 2 次 = 3 次
    expect(callCount).toBe(3)
    expect(error.value).toBeInstanceOf(Error)
  })
})

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

describe('useRequest errorSerializer', () => {
  it('将原始错误转换为自定义错误类型', async () => {
    const service = async () => {
      await asyncAwait(20)
      throw new Error('Network error')
    }

    const [{ error }] = withSetup(() =>
      useRequest(service, {
        errorSerializer: (e: any) => ({
          code: -1,
          message: e?.message ?? String(e),
        }),
      }),
    )

    await asyncAwait(100)
    expect(error.value).toEqual({
      code: -1,
      message: 'Network error',
    })
  })

  it('errorSerializer 接收请求参数', async () => {
    const service = async (userId: number) => {
      await asyncAwait(20)
      throw new Error('User not found')
    }

    let capturedParams: any = null
    const [{ run }] = withSetup(() =>
      useRequest(service, {
        manual: true,
        errorSerializer: (e: any, params) => {
          capturedParams = params
          return {
            code: -1,
            message: `${e?.message} (userId: ${params[0]})`,
          }
        },
      }),
    )

    await run(42)
    await asyncAwait(50)
    expect(capturedParams).toEqual([42])
  })

  it('onError 回调接收转换后的错误', async () => {
    const service = async () => {
      await asyncAwait(20)
      throw new Error('Original error')
    }

    let receivedError: any = null
    const [{ error }] = withSetup(() =>
      useRequest(service, {
        errorSerializer: (e: any) => ({
          code: 500,
          message: e?.message ?? 'Unknown',
        }),
        onError: (err) => {
          receivedError = err
        },
      }),
    )

    await asyncAwait(100)
    expect(receivedError).toEqual({ code: 500, message: 'Original error' })
    expect(error.value).toEqual({ code: 500, message: 'Original error' })
  })

  it('没有 errorSerializer 时 error 保持原始类型', async () => {
    const service = async () => {
      await asyncAwait(20)
      throw new Error('Raw error')
    }

    const [{ error }] = withSetup(() => useRequest(service))

    await asyncAwait(100)
    expect(error.value).toBeInstanceOf(Error)
    expect((error.value as Error).message).toBe('Raw error')
  })

  it('errorSerializer 处理不同类型的错误', async () => {
    const service = async (errorType: string) => {
      await asyncAwait(20)
      if (errorType === 'string')
      // eslint-disable-next-line no-throw-literal
        throw 'String error'

      if (errorType === 'object')
      // eslint-disable-next-line no-throw-literal
        throw { status: 404, msg: 'Not found' }

      throw new Error('Error object')
    }

    const [{ run, error }] = withSetup(() =>
      useRequest(service, {
        manual: true,
        errorSerializer: (e: any) => {
          if (typeof e === 'string')
            return { code: -1, message: e }

          if (e?.status)
            return { code: e.status, message: e.msg }

          return { code: -1, message: e?.message ?? 'Unknown error' }
        },
      }),
    )

    await run('string')
    await asyncAwait(50)
    expect(error.value).toEqual({ code: -1, message: 'String error' })

    await run('object')
    await asyncAwait(50)
    expect(error.value).toEqual({ code: 404, message: 'Not found' })
  })
})

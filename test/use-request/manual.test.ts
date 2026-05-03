import { describe, expect, it } from 'vitest'
import { useRequest } from '../../src/hooks'
import { asyncAwait, withSetup } from '../utils.ts'

describe('useRequest 手动执行', () => {
  it('manual: true 时不自动执行', async () => {
    let called = false
    const service = async () => {
      called = true
      return 'ok'
    }

    const [{ data, loading }] = withSetup(() =>
      useRequest(service, { manual: true }),
    )

    await asyncAwait(50)
    expect(called).toBe(false)
    expect(data.value).toBeUndefined()
    expect(loading.value).toBe(false)
  })

  it('run 手动触发执行', async () => {
    const service = async () => {
      await asyncAwait(30)
      return 'done'
    }

    const [{ run, data }] = withSetup(() =>
      useRequest(service, { manual: true }),
    )

    await run()
    await asyncAwait(50)
    expect(data.value).toBe('done')
  })

  it('refresh 使用上次参数重新请求', async () => {
    let count = 0
    const service = async (id: number) => {
      await asyncAwait(20)
      count++
      return { id, count }
    }

    const [{ run, refresh, data }] = withSetup(() =>
      useRequest(service, { manual: true }),
    )

    await run(42)
    await asyncAwait(50)
    expect(data.value).toEqual({ id: 42, count: 1 })

    await refresh()
    await asyncAwait(50)
    expect(data.value).toEqual({ id: 42, count: 2 })
  })

  it('defaultParams 自动传入 service', async () => {
    let captured: any[] = []
    const service = async (id: number, name: string) => {
      await asyncAwait(20)
      captured = [id, name]
      return 'ok'
    }

    withSetup(() =>
      useRequest(service, { defaultParams: [1, 'Alice'] }),
    )

    await asyncAwait(100)
    expect(captured).toEqual([1, 'Alice'])
  })
})

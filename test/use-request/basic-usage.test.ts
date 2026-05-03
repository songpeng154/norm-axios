import { describe, expect, it } from 'vitest'
import { useRequest } from '../../src/hooks'
import { asyncAwait, withSetup } from '../utils.ts'

describe('useRequest 基础用法', () => {
  it('自动执行 service，正确返回 data', async () => {
    const service = async () => {
      await asyncAwait(30)
      return { name: 'Alice' }
    }

    const [{ data, loading, finished }] = withSetup(() => useRequest(service))

    expect(loading.value).toBe(true)
    expect(finished.value).toBe(false)

    await asyncAwait(100)
    expect(data.value).toEqual({ name: 'Alice' })
    expect(loading.value).toBe(false)
    expect(finished.value).toBe(true)
  })

  it('请求失败时 error 被正确设置', async () => {
    const service = async () => {
      await asyncAwait(20)
      throw new Error('fail')
    }

    const [{ error, data }] = withSetup(() => useRequest(service))

    await asyncAwait(100)
    expect(error.value).toBeInstanceOf(Error)
    expect((error.value as Error).message).toBe('fail')
    expect(data.value).toBeUndefined()
  })

  it('service 参数通过 run 传入并记录在 params 中', async () => {
    let captured: any[] = []
    const service = async (id: number, name: string) => {
      await asyncAwait(20)
      captured = [id, name]
      return `${id}-${name}`
    }

    const [{ run, params, data }] = withSetup(() =>
      useRequest(service, { manual: true }),
    )

    await run(1, 'Alice')
    await asyncAwait(50)
    expect(captured).toEqual([1, 'Alice'])
    expect(params.value).toEqual([1, 'Alice'])
    expect(data.value).toBe('1-Alice')
  })
})

import { describe, expect, it } from 'vitest'
import { useRequest } from '../../src/hooks'
import { asyncAwait, withSetup } from '../utils.ts'

describe('useRequest 数据突变', () => {
  it('mutate 直接修改 data', async () => {
    const service = async () => {
      await asyncAwait(20)
      return { name: 'Alice' }
    }

    const [{ data, mutate }] = withSetup(() => useRequest(service))
    await asyncAwait(100)
    expect(data.value).toEqual({ name: 'Alice' })

    mutate({ name: 'Bob' })
    expect(data.value).toEqual({ name: 'Bob' })
  })

  it('mutate 支持函数式更新', async () => {
    const service = async () => {
      await asyncAwait(20)
      return { count: 1 }
    }

    const [{ data, mutate }] = withSetup(() => useRequest(service))
    await asyncAwait(100)

    mutate(old => ({ count: old!.count + 1 }))
    expect(data.value).toEqual({ count: 2 })
  })
})

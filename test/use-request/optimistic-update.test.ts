import { describe, expect, it } from 'vitest'
import { useRequest } from '../../src/hooks'
import { asyncAwait, withSetup } from '../utils.ts'

describe('useRequest 乐观更新', () => {
  it('optimisticUpdate 立即更新 data，请求失败后还原', async () => {
    let shouldFail = false
    const service = async (name: string) => {
      await asyncAwait(30)
      if (shouldFail) throw new Error('fail')
      return { name }
    }

    const [{ data, run, optimisticUpdate, error }] = withSetup(() =>
      useRequest(service, { manual: true }),
    )

    // 先成功一次，设置初始数据
    await run('Alice')
    await asyncAwait(50)
    expect(data.value).toEqual({ name: 'Alice' })

    // 乐观更新：立即生效
    shouldFail = true
    optimisticUpdate({ name: 'Bob' })
    expect(data.value).toEqual({ name: 'Bob' })

    // 请求失败后自动还原
    await asyncAwait(100)
    expect(error.value).toBeInstanceOf(Error)
    expect(data.value).toEqual({ name: 'Alice' })
  })
})

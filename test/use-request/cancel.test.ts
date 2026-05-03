import { describe, expect, it } from 'vitest'
import { useRequest } from '../../src/hooks'
import { asyncAwait, withSetup } from '../utils.ts'

describe('useRequest 取消请求', () => {
  it('cancel 取消正在进行的请求，不更新 data', async () => {
    const service = async () => {
      await asyncAwait(100)
      return 'result'
    }

    const [{ run, cancel, data, loading }] = withSetup(() =>
      useRequest(service, { manual: true }),
    )

    run()
    await asyncAwait(20)
    expect(loading.value).toBe(true)

    cancel()
    await asyncAwait(150)
    expect(data.value).toBeUndefined()
    expect(loading.value).toBe(false)
  })
})

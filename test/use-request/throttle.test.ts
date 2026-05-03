import { describe, expect, it } from 'vitest'
import { useRequest } from '../../src/hooks'
import { asyncAwait, withSetup } from '../utils.ts'

describe('useRequest 节流', () => {
  it('throttleRun 在指定时间内只执行一次', async () => {
    let callCount = 0
    const service = async () => {
      callCount++
      return callCount
    }

    const [{ throttleRun }] = withSetup(() =>
      useRequest(service, {
        manual: true,
        throttleWait: 100,
      }),
    )

    throttleRun()
    throttleRun()
    throttleRun()

    await asyncAwait(50)
    expect(callCount).toBe(1)
  })
})

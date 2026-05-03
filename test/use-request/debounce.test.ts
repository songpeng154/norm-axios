import { describe, expect, it } from 'vitest'
import { useRequest } from '../../src/hooks'
import { asyncAwait, withSetup } from '../utils.ts'

describe('useRequest 防抖', () => {
  it('debounceRun 在指定时间内只执行一次', async () => {
    let callCount = 0
    const service = async () => {
      callCount++
      return callCount
    }

    const [{ debounceRun }] = withSetup(() =>
      useRequest(service, {
        manual: true,
        debounceWait: 100,
      }),
    )

    debounceRun()
    debounceRun()
    debounceRun()

    await asyncAwait(150)
    expect(callCount).toBe(1)
  })
})

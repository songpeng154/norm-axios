import { describe, expect, it } from 'vitest'
import { useRequest } from '../../src/hooks'
import { asyncAwait, withSetup } from '../utils.ts'

describe('useRequest 轮询', () => {
  it('pollingInterval 大于 0 时自动轮询', async () => {
    let callCount = 0
    const service = async () => {
      callCount++
      return callCount
    }

    withSetup(() =>
      useRequest(service, { pollingInterval: 80 }),
    )

    await asyncAwait(30)
    expect(callCount).toBe(1)

    await asyncAwait(100)
    expect(callCount).toBeGreaterThanOrEqual(2)
  })
})

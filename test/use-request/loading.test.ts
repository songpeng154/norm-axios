import { describe, expect, it } from 'vitest'
import { useRequest } from '../../src/hooks'
import { asyncAwait, withSetup } from '../utils.ts'

describe('useRequest -> loading 模块测试', () => {
  it('如果服务在 loadingDelay 内返回，loading 始终为 false', async () => {
    const fastService = async (): Promise<string> => {
      await asyncAwait(100)
      return 'ok'
    }

    const [{ loading }] = withSetup(() =>
      useRequest(fastService, {
        loadingDelay: 200,
      }),
    )

    expect(loading.value).toBe(false)
    await asyncAwait(50)
    expect(loading.value).toBe(false)

    await asyncAwait(100)
    expect(loading.value).toBe(false)
  })

  it('如果服务耗时大于 loadingDelay，loading 会在延迟后变为 true', async () => {
    const slowService = async (): Promise<string> => {
      await asyncAwait(300)
      return 'ok'
    }

    const [{ loading }] = withSetup(() =>
      useRequest(slowService, {
        loadingDelay: 100,
      }),
    )

    expect(loading.value).toBe(false)

    await asyncAwait(150)
    expect(loading.value).toBe(true)

    await asyncAwait(200)
    expect(loading.value).toBe(false)
  })

  it('使用 loadingKeep 保证 loading 至少显示指定时长 (防闪烁)', async () => {
    const veryFastService = async (): Promise<string> => {
      await asyncAwait(50)
      return 'ok'
    }

    const [{ loading }] = withSetup(() =>
      useRequest(veryFastService, {
        loadingKeep: 300,
      }),
    )

    expect(loading.value).toBe(true)

    await asyncAwait(100)
    expect(loading.value).toBe(true)

    await asyncAwait(250)
    expect(loading.value).toBe(false)
  })

  it('loadingDelay 和 loadingKeep 组合使用', async () => {
    const service = async (): Promise<string> => {
      await asyncAwait(200)
      return 'ok'
    }

    const [{ loading }] = withSetup(() =>
      useRequest(service, {
        loadingDelay: 100,
        loadingKeep: 300,
      }),
    )

    expect(loading.value).toBe(false)

    await asyncAwait(150)
    expect(loading.value).toBe(true)

    await asyncAwait(100)
    expect(loading.value).toBe(true)

    await asyncAwait(200)
    expect(loading.value).toBe(false)
  })
})

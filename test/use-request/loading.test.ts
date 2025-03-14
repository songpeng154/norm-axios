import { describe } from 'vitest'
import { useRequest } from '../../src'
import { asyncAwait, mockResponse, withSetup } from '../utils.ts'

describe('useRequest -> loading 模块', () => {
  it('如果服务 300毫秒 以内返回，那么 loading 就不会为 true ', async () => {
    const server = mockResponse([Date.now()], 200)
    const [{ loading }] = withSetup(() => useRequest(server, {
      loadingDelay: 300,
    }))
    // 初始状态，loading 应该是 false
    expect(loading.value).toBe(false)

    // 等待 200ms，loading 仍然应该是 false
    await asyncAwait(200)
    expect(loading.value).toBe(false)

    // 等待 200ms，loading 仍然应该是 false
    await asyncAwait(200)
    expect(loading.value).toBe(false)

    await asyncAwait(200)
    expect(loading.value).toBe(false)
  })

  it('如果服务返回时间大于 300ms，那么 loading 在请求时间小于 300ms 的为 false,大于 300ms 为 true ,请求完成后 loading 为 false', async () => {
    const server = mockResponse([Date.now()], 400)
    const [{ loading }] = withSetup(() => useRequest(server, {
      loadingDelay: 300,
    }))
    // 初始状态，loading 应该是 false
    expect(loading.value).toBe(false)

    // 等待 200ms，loading 仍然应该是 false
    await asyncAwait(200)
    expect(loading.value).toBe(false)

    // 等待 100ms，loading 仍然应该是 true, 200 + 100 = 延迟 loading
    await asyncAwait(100)
    expect(loading.value).toBe(true)

    // 等待 100ms，loading 仍然应该是 false， 200 + 100 + 100 = 接口请求完成
    await asyncAwait(100)
    expect(loading.value).toBe(false)
  })

  it('loading 会在 500ms 之前是 true', async () => {
    const server = mockResponse([Date.now()], 400)
    const [{ loading }] = withSetup(() => useRequest(server, {
      loadingKeep: 500,
    }))

    await asyncAwait(0)

    expect(loading.value).toBe(true)

    await asyncAwait(200)
    expect(loading.value).toBe(true)

    await asyncAwait(100)
    expect(loading.value).toBe(true)

    await asyncAwait(100)
    expect(loading.value).toBe(true)

    await asyncAwait(100)
    expect(loading.value).toBe(false)
  })

  it('loading 会在 700ms 之前是 true', async () => {
    const server = mockResponse([Date.now()], 700)
    const [{ loading }] = withSetup(() => useRequest(server, {
      loadingKeep: 500,
    }))

    await asyncAwait(0)

    expect(loading.value).toBe(true)

    await asyncAwait(200)
    expect(loading.value).toBe(true)

    await asyncAwait(100)
    expect(loading.value).toBe(true)

    await asyncAwait(100)
    expect(loading.value).toBe(true)

    await asyncAwait(100)
    expect(loading.value).toBe(true)

    await asyncAwait(100)
    expect(loading.value).toBe(true)

    await asyncAwait(100)
    expect(loading.value).toBe(false)
  })

  it('loading 会在 700ms 之前是 true 2', async () => {
    const server = mockResponse([Date.now()], 400)
    const [{ loading }] = withSetup(() => useRequest(server, {
      loadingKeep: 500,
      loadingDelay: 300,
    }))

    await asyncAwait(0)

    expect(loading.value).toBe(false)

    await asyncAwait(200)
    expect(loading.value).toBe(false)

    await asyncAwait(100)
    expect(loading.value).toBe(true)

    await asyncAwait(100)
    expect(loading.value).toBe(true)

    await asyncAwait(100)
    expect(loading.value).toBe(false)
  })
})

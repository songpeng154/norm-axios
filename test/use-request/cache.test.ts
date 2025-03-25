import { describe, expect } from 'vitest'
import { useRequest } from '../../src'
import { asyncAwait, mockResponse, withSetup } from '../utils.ts'

describe('useRequest -> cache', () => {
  it('useRequest第一次初始化 data 是空的,默认请求完成后，data 有值，useRequest 第二次初始化的时候有值，两秒后更新 data 的值', async () => {
    const server = mockResponse([Date.now()], 200)
    const [{ data: data1 }] = withSetup(() => useRequest(server, {
      cacheKey: 'cache',
    }))

    expect(data1.value).toBe(undefined)

    await asyncAwait(200)

    expect(data1.value).toBeDefined()

    const [{ data: data2 }] = withSetup(() => useRequest(server, {
      cacheKey: 'cache',
    }))

    console.log(data2.value)
    expect(data2.value).toBeDefined()
  })

  it('useRequest', async () => {
    const server = mockResponse([Date.now()], 200)
    const [{ data, loading, run }] = withSetup(() => useRequest(server, {
      cacheKey: 'cache',
      staleTime: 5000,
    }))

    expect(data.value).toBe(undefined)

    await asyncAwait(10)
    console.log(loading.value)
    await asyncAwait(200)
    console.log(data.value)
    console.log(loading.value)
    expect(data.value).toBeDefined()
    run()
    await asyncAwait(10)
    console.log(loading.value)
    await asyncAwait(200)
    console.log(data.value)
    console.log(loading.value)
  })
})

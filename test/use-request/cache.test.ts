import { describe, expect } from 'vitest'
import { useRequest } from '../../src'
import { asyncAwait, mockParamsResponse, mockResponse, withSetup } from '../utils.ts'

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

  it('相同的 key 同时请求，它们会用同一个 Promise,返回结果一致', async () => {
    const server = mockResponse([Date.now()], 200)
    const [{ data: data1 }] = withSetup(() => useRequest(server, {
      cacheKey: 'cache',
    }))

    const [{ data: data2 }] = withSetup(() => useRequest(server, {
      cacheKey: 'cache',
    }))

    await asyncAwait(400)
    console.log(data1.value)
    console.log(data2.value)
    expect(data1.value).toBe(data2.value)
  })

  it('同时请求共用一个 Promise', async () => {
    const server = mockParamsResponse(200)
    const [{ data: data1 }] = withSetup(() => useRequest(server, {
      defaultParams: [1],
      cacheKey: 'cache',
    }))

    const [{ data: data2 }] = withSetup(() => useRequest(server, {
      defaultParams: [2],
      cacheKey: 'cache',
    }))

    await asyncAwait(400)

    expect(data1.value).toBe(data2.value)
  })

  it('数据同步', async () => {
    const server = mockParamsResponse(200)
    const [{ data: data1, run }] = withSetup(() => useRequest(server, {
      defaultParams: [1],
      cacheKey: 'cache',
    }))

    const [{ data: data2 }] = withSetup(() => useRequest(server, {
      defaultParams: [2],
      cacheKey: 'cache',
    }))

    const [{ data: data3 }] = withSetup(() => useRequest(server, {
      defaultParams: [3],
      cacheKey: 'cache',
    }))

    await asyncAwait(400)

    expect(data1.value).toBe(data2.value)

    run(2)
    await asyncAwait(400)
    expect(data1.value).toBe(data2.value)
    console.log(data3.value)
  })
})

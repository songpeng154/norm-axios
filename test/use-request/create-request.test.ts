import type { ApiError, ApiResponse } from './helpers.ts'
import { describe, expect, it } from 'vitest'
import { createRequest } from '../../src/core/request'
import { asyncAwait, withSetup } from '../utils.ts'

// ─── 模拟不同后台响应结构 ──────────────────────────────────────────────

// 标准结构：{ code, message, data }
interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
}

// REST 风格：{ status, result }
interface RestResponse<T = any> {
  status: number
  result: T
}

// 带 errno 风格：{ errno, errmsg, data }
interface ErrnoResponse<T = any> {
  errno: number
  errmsg: string
  data: T
}

// 嵌套结构：{ response: { data } }
interface NestedResponse<T = any> {
  code: number
  response: {
    data: T
  }
}

// 列表响应：{ list, total }
interface ListResponse<T = any> {
  list: T[]
  total: number
}

// 深层嵌套：{ data: { attributes } }
interface JsonApiResponse<T = any> {
  data: {
    id: string
    type: string
    attributes: T
  }
}

// ─── 业务数据类型 ──────────────────────────────────────────────────────

interface UserInfo {
  id: number
  name: string
  email: string
}

interface OrderInfo {
  orderId: string
  amount: number
}

describe('createRequest', () => {
  describe('无 dataKey — 等价于直接 useRequest', () => {
    it('返回完整响应体', async () => {
      const useApi = createRequest()

      const service = async (): Promise<ApiResponse<UserInfo>> => {
        await asyncAwait(20)
        return {
          code: 0,
          message: 'success',
          data: { id: 1, name: 'Alice', email: 'alice@example.com' },
        }
      }

      const [{ data }] = withSetup(() => useApi(service))

      await asyncAwait(100)
      // 没有 dataKey 时，data 就是整个响应体
      expect(data.value).toEqual({
        code: 0,
        message: 'success',
        data: { id: 1, name: 'Alice', email: 'alice@example.com' },
      })
    })

    it('支持 formatData 二次处理', async () => {
      const useApi = createRequest()

      const service = async (): Promise<ApiResponse<UserInfo>> => {
        await asyncAwait(20)
        return {
          code: 0,
          message: 'success',
          data: { id: 1, name: 'Alice', email: 'alice@example.com' },
        }
      }

      const [{ data }] = withSetup(() =>
        useApi(service, {
          formatData: res => res.data,
        }),
      )

      await asyncAwait(100)
      expect(data.value).toEqual({ id: 1, name: 'Alice', email: 'alice@example.com' })
    })
  })

  describe('有 dataKey — 自动提取数据', () => {
    it('提取 data 字段', async () => {
      const useApi = createRequest({ dataKey: 'data' })

      const service = async (): Promise<ApiResponse<UserInfo>> => {
        await asyncAwait(20)
        return {
          code: 0,
          message: 'success',
          data: { id: 1, name: 'Alice', email: 'alice@example.com' },
        }
      }

      const [{ data, rawData }] = withSetup(() => useApi(service))

      await asyncAwait(100)
      console.log(rawData.value)
      expect(data.value).toEqual({ id: 1, name: 'Alice', email: 'alice@example.com' })
    })

    it('提取嵌套字段 result.data', async () => {
      const useApi = createRequest({ dataKey: 'result.data' })

      const service = async () => {
        await asyncAwait(20)
        return {
          code: 0,
          result: {
            data: { orderId: 'ORD001', amount: 99.9 },
          },
        }
      }

      const [{ data }] = withSetup(() => useApi(service))

      await asyncAwait(100)
      expect(data.value).toEqual({ orderId: 'ORD001', amount: 99.9 })
    })

    it('提取深层嵌套 a.b.c', async () => {
      const useApi = createRequest({ dataKey: 'a.b.c' })

      const service = async () => {
        await asyncAwait(20)
        return { a: { b: { c: 'deep value' } } }
      }

      const [{ data }] = withSetup(() => useApi(service))

      await asyncAwait(100)
      expect(data.value).toBe('deep value')
    })

    it('路径不存在时返回 undefined', async () => {
      const useApi = createRequest({ dataKey: 'data.items' })

      const service = async () => {
        await asyncAwait(20)
        return { code: 0, data: null }
      }

      const [{ data }] = withSetup(() => useApi(service))

      await asyncAwait(100)
      expect(data.value).toBeUndefined()
    })
  })

  describe('dataKey + formatData 组合使用', () => {
    it('dataSerializer 提取后 formatData 再处理', async () => {
      const useApi = createRequest({ dataKey: 'data' })

      const service = async (): Promise<ApiResponse<UserInfo[]>> => {
        await asyncAwait(20)
        return {
          code: 0,
          message: 'success',
          data: [
            { id: 1, name: 'Alice', email: 'alice@example.com' },
            { id: 2, name: 'Bob', email: 'bob@example.com' },
          ],
        }
      }

      const [{ data }] = withSetup(() =>
        useApi(service, {
          formatData: users => users.map(u => u.name),
        }),
      )

      await asyncAwait(100)
      expect(data.value).toEqual(['Alice', 'Bob'])
    })

    it('formatData 抛错被 onError 捕获', async () => {
      const useApi = createRequest({ dataKey: 'data' })

      const service = async (): Promise<ApiResponse<null>> => {
        await asyncAwait(20)
        return { code: 1001, message: '用户不存在', data: null }
      }

      let errorMsg = ''
      const [{ error }] = withSetup(() =>
        useApi(service, {
          formatData: (data: any) => {
            if (!data) throw new Error('empty data')
            return data
          },
          onError: (err) => {
            errorMsg = err.message
          },
        }),
      )

      await asyncAwait(100)
      expect(error.value).toBeInstanceOf(Error)
      expect(errorMsg).toBe('empty data')
    })
  })

  describe('生命周期回调', () => {
    it('onSuccess 接收 formatData 处理后的数据', async () => {
      const useApi = createRequest({ dataKey: 'data' })

      const service = async (): Promise<ApiResponse<UserInfo>> => {
        await asyncAwait(20)
        return {
          code: 0,
          message: 'success',
          data: { id: 1, name: 'Alice', email: 'alice@example.com' },
        }
      }

      let result: any = null
      withSetup(() =>
        useApi(service, {
          onSuccess(data) {
            result = data
          },
        }),
      )

      await asyncAwait(100)
      expect(result).toEqual({ id: 1, name: 'Alice', email: 'alice@example.com' })
    })

    it('onError 在 service 抛错时触发', async () => {
      const useApi = createRequest({ dataKey: 'data' })

      const service = async () => {
        await asyncAwait(20)
        throw new Error('network error')
      }

      let err: any = null
      withSetup(() =>
        useApi(service, {
          onError(error) {
            err = error
          },
        }),
      )

      await asyncAwait(100)
      expect(err).toBeInstanceOf(Error)
      expect(err.message).toBe('network error')
    })
  })

  describe('手动执行模式', () => {
    it('manual: true 时不自动执行', async () => {
      const useApi = createRequest({ dataKey: 'data' })

      let called = false
      const service = async (): Promise<ApiResponse<string>> => {
        called = true
        await asyncAwait(20)
        return { code: 0, message: 'ok', data: 'result' }
      }

      const [{ data, loading }] = withSetup(() =>
        useApi(service, { manual: true }),
      )

      await asyncAwait(50)
      expect(called).toBe(false)
      expect(data.value).toBeUndefined()
      expect(loading.value).toBe(false)
    })

    it('手动调用 run 触发请求', async () => {
      const useApi = createRequest({ dataKey: 'data' })

      const service = async (): Promise<ApiResponse<UserInfo>> => {
        await asyncAwait(20)
        return {
          code: 0,
          message: 'success',
          data: { id: 1, name: 'Alice', email: 'alice@example.com' },
        }
      }

      const [{ run, data }] = withSetup(() =>
        useApi(service, { manual: true }),
      )

      await run()
      await asyncAwait(100)
      expect(data.value).toEqual({ id: 1, name: 'Alice', email: 'alice@example.com' })
    })

    it('run 传参记录在 params 中', async () => {
      const useApi = createRequest({ dataKey: 'data' })

      const service = async (id: number): Promise<ApiResponse<UserInfo>> => {
        await asyncAwait(20)
        return {
          code: 0,
          message: 'success',
          data: { id, name: 'Alice', email: 'alice@example.com' },
        }
      }

      const [{ run, params }] = withSetup(() =>
        useApi(service, { manual: true }),
      )

      await run(42)
      await asyncAwait(50)
      expect(params.value).toEqual([42])
    })
  })

  describe('类型推导', () => {
    it('无 dataKey 时 data 类型为完整响应体', async () => {
      const useApi = createRequest()

      const service = async (): Promise<ApiResponse<UserInfo>> => {
        await asyncAwait(20)
        return {
          code: 0,
          message: 'success',
          data: { id: 1, name: 'Alice', email: 'alice@example.com' },
        }
      }

      const [{ data }] = withSetup(() => useApi(service))

      await asyncAwait(100)
      // data 应该是 ApiResponse<UserInfo>
      void (data.value satisfies ApiResponse<UserInfo> | undefined)
      expect(data.value!.code).toBe(0)
    })

    it('有 dataKey 时 data 类型为提取后的类型', async () => {
      const useApi = createRequest({ dataKey: 'data' })

      const service = async (): Promise<ApiResponse<UserInfo>> => {
        await asyncAwait(20)
        return {
          code: 0,
          message: 'success',
          data: { id: 1, name: 'Alice', email: 'alice@example.com' },
        }
      }

      const [{ data }] = withSetup(() => useApi(service))

      await asyncAwait(100)
      // data 应该是 UserInfo
      void (data.value satisfies UserInfo | undefined)
      expect(data.value!.name).toBe('Alice')
    })
  })

  describe('不同 service 复用同一 useApi', () => {
    it('不同 service 返回不同类型，各自正确提取', async () => {
      const useApi = createRequest({ dataKey: 'data' })

      const getUser = async (): Promise<ApiResponse<UserInfo>> => {
        await asyncAwait(20)
        return {
          code: 0,
          message: 'ok',
          data: { id: 1, name: 'Alice', email: 'alice@example.com' },
        }
      }

      const getOrder = async (): Promise<ApiResponse<OrderInfo>> => {
        await asyncAwait(20)
        return {
          code: 0,
          message: 'ok',
          data: { orderId: 'ORD001', amount: 99.9 },
        }
      }

      const [{ data: userData }] = withSetup(() => useApi(getUser))
      const [{ data: orderData }] = withSetup(() => useApi(getOrder))
      await asyncAwait(100)
      expect(userData.value).toEqual({ id: 1, name: 'Alice', email: 'alice@example.com' })
      expect(orderData.value).toEqual({ orderId: 'ORD001', amount: 99.9 })
    })
  })

  // ─── 不同后台响应结构适配 ──────────────────────────────────────────────

  describe('REST 风格响应 { status, result }', () => {
    it('提取 result 字段', async () => {
      const useApi = createRequest({ dataKey: 'result' })

      const service = async (): Promise<RestResponse<UserInfo>> => {
        await asyncAwait(20)
        return {
          status: 200,
          result: { id: 1, name: 'Alice', email: 'alice@example.com' },
        }
      }

      const [{ data }] = withSetup(() => useApi(service))

      await asyncAwait(100)
      expect(data.value).toEqual({ id: 1, name: 'Alice', email: 'alice@example.com' })
    })

    it('提取 result.data 嵌套字段', async () => {
      const useApi = createRequest({ dataKey: 'result.data' })

      const service = async () => {
        await asyncAwait(20)
        return {
          status: 200,
          result: {
            data: { id: 1, name: 'Alice', email: 'alice@example.com' },
          },
        }
      }

      const [{ data }] = withSetup(() => useApi(service))

      await asyncAwait(100)
      expect(data.value).toEqual({ id: 1, name: 'Alice', email: 'alice@example.com' })
    })
  })

  describe('errno 风格响应 { errno, errmsg, data }', () => {
    it('提取 data 字段', async () => {
      const useApi = createRequest({ dataKey: 'data' })

      const service = async (): Promise<ErrnoResponse<UserInfo>> => {
        await asyncAwait(20)
        return {
          errno: 0,
          errmsg: 'success',
          data: { id: 1, name: 'Alice', email: 'alice@example.com' },
        }
      }

      const [{ data }] = withSetup(() => useApi(service))

      await asyncAwait(100)
      expect(data.value).toEqual({ id: 1, name: 'Alice', email: 'alice@example.com' })
    })
  })

  describe('嵌套结构响应 { code, response: { data } }', () => {
    it('提取 response.data 字段', async () => {
      const useApi = createRequest({ dataKey: 'response.data' })

      const service = async (): Promise<NestedResponse<UserInfo>> => {
        await asyncAwait(20)
        return {
          code: 0,
          response: {
            data: { id: 1, name: 'Alice', email: 'alice@example.com' },
          },
        }
      }

      const [{ data }] = withSetup(() => useApi(service))

      await asyncAwait(100)
      expect(data.value).toEqual({ id: 1, name: 'Alice', email: 'alice@example.com' })
    })
  })

  describe('列表响应 { list, total }', () => {
    it('提取完整列表响应', async () => {
      const useApi = createRequest()

      const service = async (): Promise<ListResponse<UserInfo>> => {
        await asyncAwait(20)
        return {
          list: [
            { id: 1, name: 'Alice', email: 'alice@example.com' },
            { id: 2, name: 'Bob', email: 'bob@example.com' },
          ],
          total: 2,
        }
      }

      const [{ data }] = withSetup(() => useApi(service))

      await asyncAwait(100)
      expect(data.value!.list).toHaveLength(2)
      expect(data.value!.total).toBe(2)
    })

    it('提取 list 字段', async () => {
      const useApi = createRequest({ dataKey: 'list' })

      const service = async (): Promise<ListResponse<UserInfo>> => {
        await asyncAwait(20)
        return {
          list: [
            { id: 1, name: 'Alice', email: 'alice@example.com' },
            { id: 2, name: 'Bob', email: 'bob@example.com' },
          ],
          total: 2,
        }
      }

      const [{ data }] = withSetup(() => useApi(service))

      await asyncAwait(100)
      expect(data.value).toHaveLength(2)
      expect(data.value![0].name).toBe('Alice')
    })
  })

  describe('JSON:API 风格响应 { data: { id, type, attributes } }', () => {
    it('提取 data.attributes 字段', async () => {
      const useApi = createRequest({ dataKey: 'data.attributes' })

      const service = async (): Promise<JsonApiResponse<UserInfo>> => {
        await asyncAwait(20)
        return {
          data: {
            id: '1',
            type: 'user',
            attributes: { id: 1, name: 'Alice', email: 'alice@example.com' },
          },
        }
      }

      const [{ data }] = withSetup(() => useApi(service))

      await asyncAwait(100)
      expect(data.value).toEqual({ id: 1, name: 'Alice', email: 'alice@example.com' })
    })

    it('提取 data.id 字段', async () => {
      const useApi = createRequest({ dataKey: 'data.id' })

      const service = async (): Promise<JsonApiResponse<UserInfo>> => {
        await asyncAwait(20)
        return {
          data: {
            id: 'user-123',
            type: 'user',
            attributes: { id: 1, name: 'Alice', email: 'alice@example.com' },
          },
        }
      }

      const [{ data }] = withSetup(() => useApi(service))

      await asyncAwait(100)
      expect(data.value).toBe('user-123')
    })
  })

  describe('多层级嵌套响应', () => {
    it('提取深层嵌套 a.b.c.d', async () => {
      const useApi = createRequest({ dataKey: 'a.b.c.d' })

      const service = async () => {
        await asyncAwait(20)
        return {
          a: {
            b: {
              c: {
                d: 'deep value',
              },
            },
          },
        }
      }

      const [{ data }] = withSetup(() => useApi(service))

      await asyncAwait(100)
      expect(data.value).toBe('deep value')
    })

    it('提取数组中的元素（通过 formatData）', async () => {
      const useApi = createRequest({ dataKey: 'data' })

      const service = async () => {
        await asyncAwait(20)
        return {
          code: 0,
          data: [1, 2, 3, 4, 5],
        }
      }

      const [{ data }] = withSetup(() =>
        useApi(service, {
          formatData: arr => arr.filter(n => n > 3),
        }),
      )

      await asyncAwait(100)
      expect(data.value).toEqual([4, 5])
    })
  })

  describe('createRequest errorSerializer', () => {
    it('全局配置 errorSerializer 作用于所有请求', async () => {
      const useApi = createRequest({
        dataKey: 'data',
        errorSerializer: (e: any) => ({
          code: e?.response?.status ?? -1,
          message: e?.message ?? String(e),
        }),
      })

      const service1 = async (): Promise<ApiResponse<string>> => {
        await asyncAwait(20)
        throw new Error('Service 1 error')
      }

      const service2 = async (): Promise<ApiResponse<number>> => {
        await asyncAwait(20)
        // eslint-disable-next-line no-throw-literal
        throw { response: { status: 404 }, message: 'Not found' }
      }

      const [{ error: error1 }] = withSetup(() => useApi(service1))
      const [{ error: error2 }] = withSetup(() => useApi(service2))

      await asyncAwait(100)
      expect(error1.value).toEqual({ code: -1, message: 'Service 1 error' })
      expect(error2.value).toEqual({ code: 404, message: 'Not found' })
    })

    it('局部 errorSerializer 覆盖全局配置', async () => {
      const useApi = createRequest({
        dataKey: 'data',
        errorSerializer: (e: any) => ({
          code: -1,
          message: 'Global error',
        }),
      })

      const service = async (): Promise<ApiResponse<string>> => {
        await asyncAwait(20)
        throw new Error('Test error')
      }

      const [{ error }] = withSetup(() =>
        useApi(service, {
          errorSerializer: (e: any) => ({
            code: 999,
            message: 'Local override',
          }),
        }),
      )

      await asyncAwait(100)
      expect(error.value).toEqual({ code: 999, message: 'Local override' })
    })

    it('全局 errorSerializer 配合 onError 使用', async () => {
      const useApi = createRequest({
        dataKey: 'data',
        errorSerializer: (e: any) => ({
          code: e?.status ?? 500,
          message: e?.message ?? 'Unknown error',
        }),
      })

      const service = async (): Promise<ApiResponse<string>> => {
        await asyncAwait(20)
        throw { status: 403, message: 'Forbidden' }
      }

      let capturedError: ApiError | null = null
      const [{ error }] = withSetup(() =>
        useApi(service, {
          onError: (err) => {
            capturedError = err
          },
        }),
      )

      await asyncAwait(100)
      expect(capturedError).toEqual({ code: 403, message: 'Forbidden' })
      expect(error.value).toEqual({ code: 403, message: 'Forbidden' })
    })

    it('errorSerializer 接收请求参数', async () => {
      const useApi = createRequest({
        dataKey: 'data',
        errorSerializer: (e: any, params) => ({
          code: -1,
          message: `Error with params: ${JSON.stringify(params)}`,
        }),
      })

      const service = async (id: number): Promise<ApiResponse<string>> => {
        await asyncAwait(20)
        throw new Error('Failed')
      }

      const [{ run }] = withSetup(() => useApi(service, { manual: true }))

      await run(42)
      await asyncAwait(50)
      // params 应该是 [42]
    })

    it('多个不同的 createRequest 实例使用不同的 errorSerializer', async () => {
      const useApi1 = createRequest({
        dataKey: 'data',
        errorSerializer: (e: any) => ({
          code: 1,
          message: `API 1: ${e?.message ?? ''}`,
        }),
      })

      const useApi2 = createRequest({
        dataKey: 'data',
        errorSerializer: (e: any) => ({
          code: 2,
          message: `API 2: ${e?.message ?? ''}`,
        }),
      })

      const service = async (): Promise<ApiResponse<string>> => {
        await asyncAwait(20)
        throw new Error('Test')
      }

      const [{ error: error1 }] = withSetup(() => useApi1(service))
      const [{ error: error2 }] = withSetup(() => useApi2(service))

      await asyncAwait(100)
      expect(error1.value).toEqual({ code: 1, message: 'API 1: Test' })
      expect(error2.value).toEqual({ code: 2, message: 'API 2: Test' })
    })
  })
})

import { describe, expect, it } from 'vitest'
import { useRequest } from '../../src/hooks'
import { asyncAwait, withSetup } from '../utils.ts'

// 模拟后端标准响应结构
interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
}

// 用户信息
interface UserInfo {
  id: number
  name: string
  email: string
  avatar?: string
}

// 列表响应
interface ListResult<T> {
  list: T[]
  total: number
  page: number
  pageSize: number
}

describe('useRequest formatData', () => {
  it('formatData 对 service 返回值做二次处理', async () => {
    const service = async (): Promise<ApiResponse<UserInfo>> => {
      await asyncAwait(20)
      return {
        code: 0,
        message: 'success',
        data: { id: 1, name: 'Alice', email: 'alice@example.com' },
      }
    }

    const [{ data }] = withSetup(() =>
      useRequest(service, {
        formatData: res => res.data,
      }),
    )

    await asyncAwait(100)
    expect(data.value!.name).toBe('Alice')
    expect(data.value).toEqual({ id: 1, name: 'Alice', email: 'alice@example.com' })
  })

  it('formatData 推导出正确的 data 类型', async () => {
    const service = async (): Promise<ApiResponse<UserInfo>> => {
      await asyncAwait(20)
      return {
        code: 0,
        message: 'success',
        data: { id: 1, name: 'Alice', email: 'alice@example.com' },
      }
    }

    const [{ data }] = withSetup(() =>
      useRequest(service, {
        formatData: res => res.data,
      }),
    )

    await asyncAwait(100)
    // data 的类型应该是 formatData 的返回值 UserInfo，不是 any
    void (data.value satisfies UserInfo | undefined)
    const name: string = data.value!.name
    expect(name).toBe('Alice')
  })

  it('formatData 可以做类型转换', async () => {
    const service = async (): Promise<ApiResponse<ListResult<number>>> => {
      await asyncAwait(20)
      return {
        code: 0,
        message: 'success',
        data: { list: [1, 2, 3], total: 3, page: 1, pageSize: 10 },
      }
    }

    const [{ data }] = withSetup(() =>
      useRequest(service, {
        formatData: res => res.data.list.map(n => n * 10),
      }),
    )

    await asyncAwait(100)
    // data 的类型应该是 number[]
    void (data.value satisfies number[] | undefined)
    expect(data.value).toEqual([10, 20, 30])
  })

  it('dataSerializer 提取后 formatData 再格式化', async () => {
    const service = async (): Promise<ApiResponse<UserInfo>> => {
      await asyncAwait(20)
      return {
        code: 0,
        message: 'success',
        data: { id: 1, name: 'Alice', email: 'alice@example.com' },
      }
    }

    // 数据流: service → dataSerializer(提取) → formatData(格式化)
    // dataSerializer 返回 any，formatData 实际接收的是提取后的数据
    const [{ data }] = withSetup(() =>
      useRequest(service, {
        dataSerializer: res => res.data,
        formatData: user => `${user.name} (${user.email})`,
      }),
    )

    await asyncAwait(100)
    expect(data.value).toBe('Alice (alice@example.com)')
  })

  it('dataSerializer + formatData 中抛错会被 onError 捕获', async () => {
    const service = async (): Promise<ApiResponse<null>> => {
      await asyncAwait(20)
      return { code: 1001, message: '用户不存在', data: null }
    }

    // dataSerializer 提取后为 null，formatData 中检测并抛错
    const [{ error }] = withSetup(() =>
      useRequest(service, {
        dataSerializer: res => res.data,
        formatData: (data: any) => {
          if (!data) throw new Error('empty data')
          return data
        },
      }),
    )

    await asyncAwait(100)
    expect(error.value).toBeInstanceOf(Error)
    expect((error.value as Error).message).toBe('empty data')
  })

  it('formatData 中抛错会被 onError 捕获', async () => {
    const service = async (): Promise<ApiResponse> => {
      await asyncAwait(20)
      return { code: 1001, message: 'token 已过期', data: null }
    }

    const [{ error }] = withSetup(() =>
      useRequest(service, {
        formatData: (res) => {
          if (res.code !== 0) throw new Error(res.message)
          return res.data
        },
      }),
    )

    await asyncAwait(100)
    expect(error.value).toBeInstanceOf(Error)
    expect((error.value as Error).message).toBe('token 已过期')
  })
})

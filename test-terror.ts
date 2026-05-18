// 测试 TError 泛型参数的正确性

import { createRequest } from './src/core/request'

// 定义全局错误类型
interface GlobalApiError {
  code: number
  message: string
}

// 定义局部错误类型
interface CustomError {
  status: number
  detail: string
}

// 测试 1: 使用全局错误类型
const useApiWithGlobalError = createRequest<'data', GlobalApiError>({
  dataKey: 'data',
  errorSerializer: (e: any) => ({
    code: e?.response?.status ?? -1,
    message: e?.message ?? String(e),
  }),
})

// 测试 2: 不指定错误类型（默认 any）
const useApiWithDefaultError = createRequest<'data'>({
  dataKey: 'data',
})

// 测试 3: 使用时覆盖错误类型
interface ApiResponse {
  data: { id: number; name: string }
}

async function testGlobalError() {
  const { error } = useApiWithGlobalError<ApiResponse>(
    async () => ({ data: { id: 1, name: 'test' } }),
  )

  // error 应该是 GlobalApiError | undefined
  if (error.value) {
    console.log(error.value.code) // ✅ 类型正确
    console.log(error.value.message) // ✅ 类型正确
  }
}

async function testOverrideError() {
  const { error } = useApiWithDefaultError<ApiResponse, [], any, any, CustomError>(
    async () => ({ data: { id: 1, name: 'test' } }),
    {
      errorSerializer: (e: any) => ({
        status: e?.response?.status ?? 500,
        detail: e?.message ?? 'Unknown error',
      }),
    },
  )

  // error 应该是 CustomError | undefined
  if (error.value) {
    console.log(error.value.status) // ✅ 类型正确
    console.log(error.value.detail) // ✅ 类型正确
  }
}

async function testDefaultError() {
  const { error } = useApiWithDefaultError<ApiResponse>(
    async () => ({ data: { id: 1, name: 'test' } }),
  )

  // error 应该是 any
  if (error.value) {
    console.log(error.value) // ✅ 类型是 any
  }
}

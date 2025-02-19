import type { AxiosError, AxiosRequestConfig, AxiosResponse, CreateAxiosDefaults } from 'axios'
import 'axios'

// 响应错误
export interface ResponseError {
  code: number | string

  msg: string

  axiosError?: AxiosError
}

// 响应内容
export type ResponseContent<
  TData = any,
  TParams = any,
  TDataStructure = any,
> = [
  TData,
  ResponseError?,
  AxiosResponse<TDataStructure, TParams>?,
]

// axios拦截器
export interface AxiosInterceptor<TDataStructure = any> {
  // 请求之前拦截器
  onBeforeRequest?: (config: AxiosRequestConfig) => void | Promise<void>

  /**
   * 响应拦截器
   * 在 onResponse 中，请不要直接抛出异常，因为下层请求捕获不到该异常。
   * 这可能导致请求流程中断或出现未预期的错误行为。
   * 不要出现该类似的操作：return Promise.reject(responseContent),请直接 return responseContent
   * @param response
   */
  onResponse?: (response: AxiosResponse<TDataStructure>) => ResponseContent<TDataStructure> | Promise<ResponseContent<TDataStructure>>

  /**
   * 响应错误
   * 在 onResponseError 中，请不要直接抛出异常，因为下层请求捕获不到该异常。
   * 这可能导致请求流程中断或出现未预期的错误行为。
   * 不要出现该类似的操作：return Promise.reject(responseContent),请直接 return responseContent
   * @param response
   */
  onResponseError?: (error: AxiosError) => ResponseContent | Promise<ResponseContent>
}

// axios配置
export interface AxiosConfig<TDataStructure = any> extends CreateAxiosDefaults {
  // 拦截器
  interceptor?: AxiosInterceptor<TDataStructure>
}

// 元数据
export interface Meta {
  test: number
}

declare module 'axios' {
  interface AxiosRequestConfig extends Partial<Meta> {}
}

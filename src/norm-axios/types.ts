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
  TResponse = any,
> = [
  TData,
  ResponseError?,
  AxiosResponse<TResponse>?,
]

// 拦截器
export interface NormAxiosInterceptor<TResponse extends Recordable = Recordable> {
  // 请求之前拦截器
  onBeforeRequest?: (config: AxiosRequestConfig) => void | Promise<void>

  /**
   * 响应拦截器
   * 在 onResponse 中，请不要直接抛出异常，因为下层请求捕获不到该异常。
   * 这可能导致请求流程中断或出现未预期的错误行为。
   * 不要出现该类似的操作：return Promise.reject(responseContent),请直接 return responseContent
   * @param response
   */
  onResponse?: (response: AxiosResponse<TResponse>) => ResponseContent<TResponse> | Promise<ResponseContent<TResponse>>

  /**
   * 响应错误
   * 在 onResponseError 中，请不要直接抛出异常，因为下层请求捕获不到该异常。
   * 这可能导致请求流程中断或出现未预期的错误行为。
   * 不要出现该类似的操作：return Promise.reject(responseContent),请直接 return responseContent
   * @param response
   */
  onResponseError?: (error: AxiosError) => ResponseContent | Promise<ResponseContent>
}

// 配置
export interface NormAxiosConfig<TResponse extends Recordable = Recordable> extends CreateAxiosDefaults {
  // 拦截器
  interceptor?: NormAxiosInterceptor<TResponse>
}

// 元数据
export interface Meta {
}

declare module 'axios' {
  interface AxiosRequestConfig extends Partial<Meta> {
  }
}

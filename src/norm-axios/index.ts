import type { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosStatic } from 'axios'
import type { Recordable } from '../types/utils.ts'
import type { NormAxiosConfig, ResponseContent } from './types.ts'
import { omit } from 'es-toolkit'

// 约定式 Axios
export default class NormAxios<TResponse extends Recordable = Recordable> {
  public axiosInstance: AxiosInstance

  public axiosConfig: NormAxiosConfig<TResponse>

  constructor(axios: AxiosStatic, config: NormAxiosConfig<TResponse>) {
    this.axiosInstance = axios.create(omit(config, ['interceptor']))
    this.axiosConfig = config

    // 请求拦截器
    this.axiosInstance.interceptors.request.use(
      async (requestConfig) => {
        await config.interceptor?.onBeforeRequest?.(requestConfig)
        return requestConfig
      },
      error => Promise.reject(error),
    )

    // 响应拦截器
    this.axiosInstance.interceptors.response.use(
      response => (config.interceptor?.onResponse?.(response) || response) as any,
      (error: AxiosError) => config?.interceptor?.onResponseError?.(error),
    )
  }

  public request<TData = any, TParams extends Recordable = Recordable>(config: AxiosRequestConfig<TParams>): Promise<ResponseContent<TData, TResponse>> {
    return this.axiosInstance.request<ResponseContent<TData, TParams>>(config) as unknown as Promise<ResponseContent<TData, TResponse>>
  }

  public get<TData = any, TParams extends Recordable = Recordable>(url: string, params?: TParams, config?: AxiosRequestConfig<TParams>) {
    this.request({
      url: '/userinfo',
      method: 'get',
      params,
    })
    return this.request<TData, TParams>({ method: 'get', url, params, ...config })
  }

  public post<TData = any, TParams extends Recordable = Recordable>(url: string, data?: TParams, config?: AxiosRequestConfig<TParams>) {
    return this.request<TData, TParams>({ method: 'post', url, data, ...config })
  }

  public put<TData = any, TParams extends Recordable = Recordable>(url: string, data?: TParams, config?: AxiosRequestConfig<TParams>) {
    return this.request<TData, TParams>({ method: 'put', url, data, ...config })
  }

  public delete<TData = any, TParams extends Recordable = Recordable>(url: string, data?: TParams, config?: AxiosRequestConfig<TParams>) {
    return this.request<TData, TParams>({ method: 'delete', url, data, ...config })
  }

  static extend<Result extends Recordable = Recordable>(axios: AxiosStatic, instance: NormAxios<Result>, config?: NormAxiosConfig<Result>): NormAxios<Result> {
    return new NormAxios(axios, Object.assign(instance.axiosConfig, config))
  }
}

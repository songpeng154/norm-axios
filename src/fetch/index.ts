import type { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios'
import type { AxiosConfig, ResponseContent } from './types.ts'
import axios from 'axios'
import { omit } from 'es-toolkit'

// 约定式 Axios
export default class NormFetch<TDataStructure extends Recordable = Recordable> {
  public axiosInstance: AxiosInstance

  public axiosConfig: AxiosConfig<TDataStructure>

  constructor(config: AxiosConfig<TDataStructure>) {
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

  public request<TData = any, TParams = any>(config: AxiosRequestConfig<TParams>): Promise<ResponseContent<TData, TParams, TDataStructure>> {
    return this.axiosInstance.request<ResponseContent<TData, TParams>>(config) as unknown as Promise<ResponseContent<TData, TParams, TDataStructure>>
  }

  // Get 请求
  public get<TData = any, TParams = any>(url: string, params?: TParams, config?: AxiosRequestConfig<TParams>) {
    return this.request<TData, TParams>({ method: 'get', url, params, ...config })
  }

  public post<TData = any, TParams = any>(url: string, data?: TParams, config?: AxiosRequestConfig<TParams>) {
    return this.request<TData, TParams>({ method: 'post', url, data, ...config })
  }

  public put<TData = any, TParams = any>(url: string, data?: TParams, config?: AxiosRequestConfig<TParams>) {
    return this.request<TData, TParams>({ method: 'put', url, data, ...config })
  }

  public delete<TData = any, TParams = any>(url: string, data?: TParams, config?: AxiosRequestConfig<TParams>) {
    return this.request<TData, TParams>({ method: 'delete', url, data, ...config })
  }

  /**
   * 继承已有的 UnifyAxios 实例
   * @param instance UnifyAxios 实例
   * @param config UnifyAxios配置
   * @return UnifyAxios 实例
   */
  static extend<Result extends Recordable = Recordable>(instance: NormFetch<Result>, config?: AxiosConfig<Result>) {
    return new NormFetch(Object.assign(instance.axiosConfig, config))
  }
}

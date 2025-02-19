import type { AxiosResponse } from 'axios'
import type { DebouncedFunction } from 'es-toolkit/dist/compat/function/debounce'
import type { EffectScope, MaybeRef, Ref, WatchSource } from 'vue'
import type { ResponseContent, ResponseError } from '../../fetch/types.ts'

export type FetchServiceFn<
  // 数据
  TData = any,
  // 方法参数
  TParams extends any[] = any[],
  // 原始数据
  TRawData = any,
> = (...args: TParams) => Promise<ResponseContent<TData, TRawData>>

// 请求配置项
export interface FetchOptions<
  // 数据
  TData = any,
  // 方法参数
  TParams extends any[] = any[],
  // 格式化数据
  TFormatData = TData,
  // 原始数据
  TRawData = any,
> {
  /**
   * data 初始的数据
   */
  initialData?: TFormatData

  /**
   * 传递给 service 的参数
   */
  defaultParams?: TParams

  /**
   * 手动执行
   * @desc  默认 false。 即在初始化时自动执行 service。如果设置为 true, 则需要手动调用 run 或 runAsync 触发执行
   * @default false
   */
  manual?: boolean

  /**
   * 当前请求是否准备好了,准备好后才可以发送请求
   * @default true
   */
  ready?: Ref<boolean>

  /**
   * 侦听一个或多个响应式数据源，如果传入 true 会自动收集 server 中的响应式数据源。当响应式数据源变化时会自动刷新服务
   */
  watchSource?: true | WatchSource | WatchSource[]

  /**
   * 是否深度观察，与 vue watch 中的 deep一致
   * @default false
   */
  watchDeep?: boolean

  /**
   * 窗口获取焦点的时候刷新请求
   * @default false
   */
  refreshOnWindowFocus?: MaybeRef<boolean>

  /**
   * 重新请求间隔（毫秒）
   * @default 5000ms
   */
  focusTimespan?: MaybeRef<number>

  /**
   * 指定 loading 的延时打开时间 (毫秒)，可以防止接口加载速度非常快，loading出现闪烁的情况
   */
  loadingDelay?: MaybeRef<number>

  /**
   * 可以让 loading 持续指定的时间 (毫秒)，可以防止 loading 一闪而过
   * 如果请求时间少于指定的时间，则最终时间为指定的时间
   * 如果请求时间大于指定的时间，则最终时间为请求的时间
   * @default 300ms
   */
  loadingKeep?: MaybeRef<number>

  /**
   * 设置防抖等待时间 (毫秒)
   * @default 500ms
   */
  debounceWait?: MaybeRef<number>

  /**
   * 防抖允许被延迟的最大值
   */
  debounceMaxWait?: MaybeRef<number>

  /**
   * 在延迟开始前执行调用
   * @default false
   */
  debounceLeading?: MaybeRef<boolean>

  /**
   * 在延迟结束后执行调用
   * @default true
   */
  debounceTrailing?: MaybeRef<boolean>

  /**
   * 设置节流等待时间 (毫秒)
   * @default 500ms
   */
  throttleWait?: MaybeRef<number>

  /**
   * 在节流开始前执行调用
   * @default true
   */
  throttleLeading?: MaybeRef<boolean>

  /**
   * 在节流结束后执行调用
   * @default true
   */
  throttleTrailing?: MaybeRef<boolean>

  /**
   * 轮询间隔（毫秒），如果值大于 0，则启动轮询模式。
   * @default 0
   */
  pollingInterval?: MaybeRef<number>

  /**
   * 屏幕不可见时轮询，当 pollingInterval 大于 0 时才生效。
   * 默认情况下，轮询在屏幕不可见时，会暂停轮询。当设置成 true 时，在屏幕不可见时，轮询任务依旧会定时执行。
   * @default false
   */
  pollingWhenDocumentHidden?: MaybeRef<boolean>

  /**
   * 窗口失去焦点时进行轮询
   * @default true
   */
  pollingWhenWindowBlur?: MaybeRef<boolean>

  /**
   * 轮询错误重试次数。如果设置为 Infinity，则无限次
   * @default 3
   */
  pollingErrorRetryCount?: MaybeRef<number>

  /**
   * 错误重试次数。如果设置为 Infinity，则无限次重试。
   */
  errorRetryCount?: MaybeRef<number>

  /**
   * 重试时间间隔，单位为毫秒
   */
  errorRetryInterval?: MaybeRef<number>

  /**
   * 请求唯一标识。如果设置了 cacheKey，我们会启用缓存机制。同一个 cacheKey 的数据全局同步。
   */
  cacheKey?: string

  /**
   * 缓存过期时间（毫秒），超过该时间会自动清除该缓存数据。
   * 设置 Infinity 表示永不过期
   * @default 600000
   */
  cacheTime?: number

  /**
   * 设置数据保持新鲜时间，在该时间内，我们认为数据是新鲜的，不会重新发起请求。
   * 设置 Infinity 表示永不过期
   */
  staleTime?: number

  /**
   * 格式化数据
   */
  formatData?: (data: TData, params: TParams, response: AxiosResponse<TRawData>) => TFormatData

  /**
   * 请求之前执行
   * @param params 请求参数
   */
  onBefore?: (params: TParams) => void

  /**
   * promise resolve 的时候执行
   * @param data 响应数据
   * @param params 请求参数
   * @param response  axios响应内容
   */
  onSuccess?: (
    data: TFormatData,
    params: TParams,
    response: AxiosResponse<TRawData>,
  ) => void

  /**
   * 请求错误的时候执行
   * @param error 错误信息
   * @param params 请求参数
   * @param response  axios响应内容
   */
  onError?: (
    error: ResponseError,
    params: TParams,
    response: AxiosResponse<TRawData>,
  ) => void

  /**
   * 最后执行,不管 service 成功失败都会执行
   * @param params 参数
   */
  onFinally?: (params: TParams) => void
}

export interface FetchState<
  // 数据
  TData = any,
  // 方法参数
  TParams extends any[] = any[],
  // 格式化数据
  TFormatData = TData,
  // 原始数据
  TRawData = any,
> {
  /**
   * service 返回的数据 ｜ 格式化后的数据
   */
  data: Undefinable<TFormatData>

  /**
   * service 返回的原始数据，取自 response.data
   */
  rawData: Undefinable<TRawData>

  /**
   * service 返回的错误
   */
  error: Undefinable<ResponseError>

  /**
   * axios 原始响应内容
   */
  response: Undefinable<AxiosResponse<TRawData>>

  /**
   * service 是否正在执行
   */
  loading: boolean

  /**
   * 请求是否已经完成
   */
  finished: boolean

  /**
   * 当次执行的 service 的参数数组。比如你触发了 run(1, 2, 3)，则 params 等于 [1, 2, 3]
   */
  params: TParams
}

export interface FetchMethod<
  // 数据
  TData,
  // 方法参数
  TParams extends unknown[],
  // 格式化数据
  TFormatData = TData,
> {
  /**
   * 手动触发 service 执行，参数会传递给 service。异常自动处理，通过 onError 反馈或者使用run.catch() 进行反馈
   * @param args 请求参数
   */
  run: (...args: TParams) => Promise<Undefinable<TFormatData>>

  /**
   * 与 run 用法一致，加了防抖功能
   * @param args 请求参数
   */
  debounceRun: DebouncedFunction<
    (...args: TParams) => Promise<Undefinable<TFormatData>>
  >

  /**
   * 与 run 用法一致，加了节流功能
   * @param args 请求参数
   */
  throttleRun: DebouncedFunction<
    (...args: TParams) => Promise<Undefinable<TFormatData>>
  >

  /**
   * 使用上次的 params，重新调用 run
   */
  refresh: () => Promise<Undefinable<TFormatData>>

  /**
   * 手动取消当前正在进行中的请求
   * 不是真正的取消请求，已发出的请求后台还是会接受到的
   * 该方法只是取消了 data、response 的赋值以及 loading 重置为 false
   */
  cancel: () => void

  /**
   * 更改 data 数据,不会更改 rawData 和 response 中的数据
   */
  mutate: (
    newData: TFormatData | ((oldData: TFormatData) => TFormatData),
  ) => void
}

export type FetchResult<
  // 数据
  TData = any,
  // 方法参数
  TParams extends any[] = any[],
  // 格式化数据
  TFormatData = TData,
  // 原始数据
  TRawData = any,
> = WrapWithComputed<FetchState<TData, TParams, TFormatData, TRawData>> &
  FetchMethod<TData, TParams, TFormatData>

export interface FetchPluginHooks<
  // 数据
  TData = any,
  // 方法参数
  TParams extends any[] = any[],
  // 格式化数据
  TFormatData = TData,
  // 原始数据
  TRawData = any,
> {
  /**
   * 请求之前钩子,如果返回 true 就表示停止后面代码的执行
   * @return boolean ｜ void
   */
  onBefore?: (params: TParams, stopExec: () => void) => void

  /**
   * 失败钩子
   */
  onError?: (
    error: ResponseError,
    params: TParams,
    response: AxiosResponse<TRawData>,
  ) => void

  /**
   * 成功钩子
   */
  onSuccess?: (
    data: TFormatData,
    params: TParams,
    response: AxiosResponse<TRawData>,
  ) => void

  /**
   * 当连续请求的时候，最后一个服务请求完成之后触发
   */
  onFinallyFetchDone?: () => void

  /**
   * 最后执行，不管 server 成功还是失败都会执行
   */
  onFinally?: (params: TParams) => void

  /**
   * 修改数据钩子
   */
  onMutate?: (data: TFormatData) => void

  /**
   * 取消请求钩子
   */
  onCancel?: () => void
}

export interface FetchContext<
  // 数据
  TData = any,
  // 方法参数
  TParams extends any[] = any[],
  // 格式化数据
  TFormatData = TData,
  // 原始数据
  TRawData = any,
> extends FetchResult<TData, TParams, TFormatData, TRawData> {
  // 当前作用域
  scope: EffectScope

  // 配置项
  options: FetchOptions<TData, TParams, TFormatData, TRawData>

  // 原始 state
  rawState: FetchState<TData, TParams, TFormatData, TRawData>

  // 设置状态
  setState: (
    state: Partial<FetchState<TData, TParams, TFormatData, TRawData>>,
  ) => void
}

export interface FetchPluginImplement<
  // 数据
  TData = any,
  // 方法参数
  TParams extends any[] = any[],
  // 格式化数据
  TFormatData = TData,
  // 原始数据
  TRawData = any,
> {
  (
    context: FetchContext<TData, TParams, TFormatData, TRawData>,
  ): FetchPluginHooks<TData, TParams, TFormatData, TRawData> | void
}

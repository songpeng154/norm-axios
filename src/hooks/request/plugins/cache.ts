import type { AxiosResponse } from 'axios'
import { omit } from 'es-toolkit'
import { reactive, watch } from 'vue'
import definePlugin from '../define-plugin.ts'

export interface CachedData<
  // 数据
  TData = any,
  // 方法参数
  TParams extends unknown[] = [],
  // 格式化数据
  TFormatData = TData,
  // 原始数据
  TRawData = any,
> {
  // 数据
  data: TFormatData

  // 原始数据
  rawData: TRawData

  // 响应体
  response?: AxiosResponse<TRawData>

  // 入参
  params: TParams

  // 请求的开始时间
  time: number

  // 定时器
  timer: NodeJS.Timeout
}

// 缓存存储
const CACHE_STORE = reactive(new Map<string, CachedData>())

// 缓存 promise
// const CACHE_PROMISE = new Map<string, Promise<ResponseContent>>()

const useCachePlugin = definePlugin(({ options, setState }) => {
  const { cacheKey, staleTime = 0, cacheTime = 600000 } = options

  const getCache = () => {
    if (!cacheKey) return

    return CACHE_STORE.get(cacheKey)
  }

  const deleteCache = () => {
    if (!cacheKey) return
    CACHE_STORE.delete(cacheKey)
  }

  const setCache = (cacheData: CachedData) => {
    if (!cacheKey) return
    CACHE_STORE.set(cacheKey, cacheData)
  }

  // 是否新鲜的
  const isFresh = (time: number) => staleTime === Infinity || time + staleTime > Date.now()

  const setCatchState = (catchData: CachedData) => {
    setState({
      ...omit(catchData, ['time', 'timer']),
    })
  }

  const cache = getCache()

  if (cache) setCatchState(cache)

  // 数据同步
  cacheKey && watch(() => CACHE_STORE.get(cacheKey), (value) => {
    setCatchState(value as any)
  })

  return {
    onBefore(_, stopExec) {
      const cache = getCache()
      if (!cache) return
      setCatchState(cache)

      // 如果新鲜的请求中就停止执行
      if (isFresh(cache.time)) stopExec()
    },
    onSuccess(data, params, response) {
      if (!cacheKey) return
      const cache = getCache()
      if (cache?.timer) clearTimeout(cache.timer)
      const timer = setTimeout(() => deleteCache(), cacheTime)
      setCache({
        data,
        params: params as [],
        rawData: response?.data,
        response,
        time: Date.now(),
        timer,
      })
    },
  }
})

export default useCachePlugin

import type { AxiosResponse } from 'axios'

export interface CachedData<
  // 数据
  TData = any,
  // 方法参数
  TParams extends any[] = any[],
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
  timer?: NodeJS.Timeout
}

// 缓存存储
const CACHE_STORE = new Map<string, CachedData>()

export const getCache = (cacheKey: string) => {
  return CACHE_STORE.get(cacheKey)
}

export const deleteCache = (cacheKey: string) => {
  CACHE_STORE.delete(cacheKey)
}

export const setCache = (cacheKey: string, cacheTime: number, cacheData: CachedData) => {
  const cache = getCache(cacheKey)
  if (cache?.timer) clearTimeout(cache.timer)
  const timer = setTimeout(() => CACHE_STORE.delete(cacheKey), cacheTime)
  CACHE_STORE.set(cacheKey, { ...cacheData, timer })
}

export const getCacheAll = () => {
  return Object.fromEntries(CACHE_STORE.entries())
}

export const clearCache = (key?: string | string[]) => {
  if (!key) return CACHE_STORE.clear()
  const cacheKeys = Array.isArray(key) ? key : [key]
  cacheKeys.forEach(cacheKey => CACHE_STORE.delete(cacheKey))
}

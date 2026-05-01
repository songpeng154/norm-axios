const CACHE_PROMISE = new Map<string, Promise<any>>()

export const getCachePromise = (cacheKey: string) => {
  return CACHE_PROMISE.get(cacheKey)
}

export const deleteCachePromise = (cacheKey: string) => {
  CACHE_PROMISE.delete(cacheKey)
}

export const setCachePromise = (cacheKey: string, promise: Promise<any>) => {
  CACHE_PROMISE.set(cacheKey, promise)
  promise
    .then((res) => {
      deleteCachePromise(cacheKey)
      return res
    })
    .catch(() => {
      // 错误由 coreRequest 的 try/catch 统一处理，这里只做缓存清理
      deleteCachePromise(cacheKey)
    })
}

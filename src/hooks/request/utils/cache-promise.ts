import type { ResponseContent } from '../../../norm-axios/types.ts'

const CACHE_PROMISE = new Map<string, Promise<ResponseContent>>()

export const getCachePromise = (cacheKey: string) => {
  return CACHE_PROMISE.get(cacheKey)
}

export const deleteCachePromise = (cacheKey: string) => {
  CACHE_PROMISE.delete(cacheKey)
}

export const setCachePromise = (cacheKey: string, promise: Promise<ResponseContent>) => {
  CACHE_PROMISE.set(cacheKey, promise)
  promise
    .then((res) => {
      deleteCachePromise(cacheKey)
      return res
    })
    .catch((err) => {
      deleteCachePromise(cacheKey)
      throw err
    })
}

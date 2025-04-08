import type { ResponseContent } from '../../../norm-axios/types.ts'
import type { CachedData } from '../utils/cache.ts'
import { omit } from 'es-toolkit'
import { ref } from 'vue'
import definePlugin from '../define-plugin.ts'
import cacheEmitter from '../utils/cache-emitter.ts'
import { getCachePromise, setCachePromise } from '../utils/cache-promise.ts'
import { getCache, setCache } from '../utils/cache.ts'

const useCachePlugin = definePlugin(({ options, setState, params }) => {
  const {
    cacheKey,
    staleTime = 0,
    cacheTime = 600000,
    getCache: getCustomizeCache,
    setCache: setCustomizeCache,
  } = options
  if (!cacheKey) return

  const isSelfEmit = ref(false)
  const isUpdate = ref(true)
  let currentServicePromise: Promise<ResponseContent>

  // 是否新鲜的
  const isFresh = (time: number) => staleTime === Infinity || time + staleTime > Date.now()

  const setCatchState = (catchData: CachedData) => {
    setState({ ...omit(catchData, ['time', 'timer']) })
  }

  const _getCache = (key: string) => {
    return getCustomizeCache ? getCustomizeCache(key, params.value) : getCache(key)
  }

  const _setCache = (key: string, cacheData: CachedData) => {
    setCustomizeCache ? setCustomizeCache(key, cacheData) : setCache(key, cacheTime, cacheData)
  }

  const cache = _getCache(cacheKey)

  if (cache) setCatchState(cache)

  // 订阅相同的缓存key
  cacheEmitter.on(cacheKey, (cache) => {
    if (isSelfEmit.value) {
      isSelfEmit.value = false
      return
    }
    setCatchState(cache)
  })

  return {
    onBefore() {
      const cache = _getCache(cacheKey)
      if (!cache) return
      setCatchState(cache)

      // 如果新鲜的请求中就停止执行
      if (isFresh(cache.time)) return { isReturned: true }
    },
    onRequest(service, params) {
      let servicePromise = getCachePromise(cacheKey)
      if (servicePromise && servicePromise !== currentServicePromise) {
        isSelfEmit.value = true
        isUpdate.value = false
        return { servicePromise }
      }
      servicePromise = service(...params)
      currentServicePromise = servicePromise
      setCachePromise(cacheKey, servicePromise)
      return { servicePromise }
    },
    onSuccess(data, params, response) {
      _setCache(cacheKey, {
        data,
        params: params as [],
        rawData: response?.data,
        response,
        time: Date.now(),
      })
      const newCache = _getCache(cacheKey)
      isSelfEmit.value = true

      if (!isUpdate.value) {
        isUpdate.value = true
        isSelfEmit.value = false
      }
      else
        cacheEmitter.emit(cacheKey, newCache!)
    },
  }
})

export default useCachePlugin

import { computed, ref, toRef } from 'vue'
import definePlugin from '../define-plugin.ts'

const useErrorRetryPlugin = definePlugin(({ finished, options, refresh }) => {
  const { errorRetryCount, errorRetryInterval = 1000 } = options
  let timer: NodeJS.Timeout

  const retryCountRef = toRef(errorRetryCount)
  const retryIntervalRef = toRef(errorRetryInterval)

  const errorCount = ref(0)

  // 是否停止重试
  const isStopRetry = computed(() => !retryCountRef.value || errorCount.value >= retryCountRef.value || !finished.value)

  const clearTimer = () => {
    timer && clearTimeout(timer)
  }

  const resetErrorCount = () => {
    errorCount.value = 0
  }

  const updateErrorCount = () => {
    errorCount.value += 1
  }

  return {
    onBefore() {
      clearTimer()
    },
    onSuccess() {
      resetErrorCount()
    },
    onError() {
      if (isStopRetry.value)
        return resetErrorCount()

      updateErrorCount()
      timer = setTimeout(refresh, retryIntervalRef.value)
    },
  }
})

export default useErrorRetryPlugin

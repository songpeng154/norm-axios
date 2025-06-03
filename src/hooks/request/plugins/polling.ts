import { useDocumentVisibility } from '@vueuse/core'
import { computed, onUnmounted, ref, toRef, watch } from 'vue'
import definePlugin from '../define-plugin.ts'

const usePollingPlugin = definePlugin(({ finished, refresh, options }) => {
  const {
    pollingInterval = 0,
    pollingWhenDocumentHidden = false,
    pollingErrorRetryCount = 3,
  } = options

  let timer: NodeJS.Timeout

  // 请求错误次数
  const errorCount = ref(0)

  // 轮询间隔（毫秒）
  const pollingIntervalRef = toRef(pollingInterval)
  // 轮询错误重试次数
  const pollingErrorRetryCountRef = toRef(pollingErrorRetryCount)
  // 窗口不可见的时候继续轮询
  const pollingWhenHiddenRef = toRef(pollingWhenDocumentHidden)

  // 文档是否可见
  const documentVisibility = useDocumentVisibility()

  // 是否停止轮询
  const isStopPolling = computed(() =>
    pollingIntervalRef.value <= 0
    || (errorCount.value - 1 >= pollingErrorRetryCountRef.value && pollingErrorRetryCountRef.value !== Infinity)
    || (!pollingWhenHiddenRef.value && documentVisibility.value === 'hidden')
    || !finished.value,
  )

  const clearTimer = () => {
    timer && clearTimeout(timer)
  }

  const resetErrorCount = () => {
    errorCount.value = 0
  }

  const updateErrorCount = () => {
    errorCount.value += 1
  }

  watch(documentVisibility, () => {
    // 窗口可见时恢复轮询
    if (documentVisibility.value === 'visible' && !isStopPolling.value)
      refresh()
  })

  onUnmounted(() => {
    clearTimer()
  })

  return {
    onBefore() {
      clearTimer()
    },
    onSuccess() {
      resetErrorCount()
    },
    onError() {
      updateErrorCount()
    },
    onFinally() {
      if (isStopPolling.value) return resetErrorCount()

      timer = setTimeout(refresh, pollingIntervalRef.value)
    },
  }
})

export default usePollingPlugin

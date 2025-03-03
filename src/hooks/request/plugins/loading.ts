import { toRef } from 'vue'
import definePlugin from '../define-plugin.ts'

const useLoadingPlugin = definePlugin(({ options, setState }) => {
  const { loadingKeep = 300, loadingDelay } = options

  // 请求开始时间
  let startTime: number
  // loading延时定时器
  let delayTimer: NodeJS.Timeout
  // loading保持定时器
  let keepTimer: NodeJS.Timeout

  const loadingDelayRef = toRef(loadingDelay)
  const loadingKeepRef = toRef(loadingKeep)

  const startDelay = (ms: number, callback: () => any) => {
    delayTimer && clearTimeout(delayTimer)
    delayTimer = setTimeout(callback, ms)
  }

  const startKeep = (ms: number, callback: () => any) => {
    keepTimer && clearTimeout(keepTimer)
    keepTimer = setTimeout(callback, ms)
  }

  const setLoading = (loading: boolean) => {
    setState({ loading })
  }

  const handleLoadingDelay = () => {
    loadingDelayRef.value ? startDelay(loadingDelayRef.value, () => setLoading(true)) : setLoading(true)
  }

  const handleLoadingKeep = (requestStartTime: number) => {
    const requestTime = Date.now() - requestStartTime
    // 如果 loadingKeep 不存在或者 请求时间 大于等于 保持时间
    if (!loadingKeepRef.value || requestTime >= loadingKeepRef.value) setLoading(false)
    // 如果 请求时间 小于 保持时间
    else if (requestTime < loadingKeepRef.value) startKeep(loadingKeepRef.value - requestTime, () => {
      setLoading(false)
    })
  }

  return {
    onBefore() {
      startTime = Date.now()
      handleLoadingDelay()
    },
    onFinallyFetchDone() {
      handleLoadingKeep(startTime)
    },
  }
})

export default useLoadingPlugin

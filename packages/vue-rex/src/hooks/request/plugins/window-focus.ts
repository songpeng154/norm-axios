import { useWindowFocus } from '@vueuse/core'
import { ref, toRef, watch } from 'vue'
import definePlugin from '../define-plugin.ts'

const useRefreshOnWindowFocusPlugin = definePlugin(({ refresh, options, scope }) => {
  const { refreshOnWindowFocus = false, focusTimespan = 5000 } = options
  const isRefreshOnWindowFocus = toRef(refreshOnWindowFocus)
  const focusTimespanRef = toRef(focusTimespan)

  // 记录失去焦点的时间
  const startTime = ref(Date.now())

  const isFocus = useWindowFocus()

  scope.run(() => {
    watch(isFocus, () => {
      if (!isRefreshOnWindowFocus.value) return
      // 记录失去焦点的时间
      if (!isFocus.value) return startTime.value = Date.now()
      // 检查时间间隔是否符合条件
      if (focusTimespanRef.value && Date.now() - startTime.value < focusTimespanRef.value) return

      void refresh()
    })
  })
})

export default useRefreshOnWindowFocusPlugin

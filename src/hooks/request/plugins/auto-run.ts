import { isBoolean } from 'es-toolkit'
import { watch, watchEffect } from 'vue'
import definePlugin from '../define-plugin.ts'

const useAutoRunPlugin = definePlugin(({ rawState, run, scope, options }) => {
  const { manual, watchDeep, watchSource } = options
  // 首次默认调用
  if (!manual && watchSource !== true)
    void run(...rawState.params)

  scope.run(() => {
    // 依赖自动收集
    if (watchSource === true) {
      watchEffect(() => {
        void run(...rawState.params)
      })
    }

    // 手动收集依赖
    if (!isBoolean(watchSource) && watchSource) {
      watch(
        watchSource,
        () => {
          void run(...rawState.params)
        },
        {
          deep: watchDeep,
        },
      )
    }
  })
})

export default useAutoRunPlugin

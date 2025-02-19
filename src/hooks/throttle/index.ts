import type { DebouncedFunction } from 'es-toolkit/dist/compat/function/debounce'
import type { MaybeRef } from 'vue'
import { throttle } from 'es-toolkit/compat'
import { toValue, watchEffect } from 'vue'

export interface ThrottleOptions {
  /**
   * If `true`, the function will be invoked on the leading edge of the timeout.
   * @default true
   */
  leading?: MaybeRef<boolean>
  /**
   * If `true`, the function will be invoked on the trailing edge of the timeout.
   * @default true
   */
  trailing?: MaybeRef<boolean>
}

function useThrottle<F extends AnyFunction>(fn: F, ms: MaybeRef<number>, options: ThrottleOptions) {
  const createThrottle = () => {
    return throttle(fn, toValue(ms), {
      leading: toValue(options.leading),
      trailing: toValue(options.trailing),
    })
  }
  let throttleFn: DebouncedFunction<F> = createThrottle()

  watchEffect(() => {
    if (throttleFn) throttleFn.cancel()

    throttleFn = createThrottle()
  })

  return throttleFn
}

export default useThrottle

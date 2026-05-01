import type { RequestOptions, RequestState } from '../types.ts'
import { computed, shallowReactive } from 'vue'

export default function useCoreState<
  // 数据
  TData = any,
  // 方法参数
  TParams extends any[] = any[],
  // 格式化数据
  TFormatData = TData,
>(options: RequestOptions<TData, TParams, TFormatData>) {
  type State = RequestState<TData, TParams, TFormatData>

  const state: State = {
    data: options.initialData,
    error: undefined,
    params: (options.defaultParams || []) as TParams,
    loading: false,
    finished: false,
  }
  const stateReactive = shallowReactive({ ...state })

  const setState = (newState: Partial<State>) => {
    Object.assign(state, newState)
    Object.assign(stateReactive, newState)
  }

  return {
    loading: computed(() => stateReactive.loading),
    finished: computed(() => stateReactive.finished),
    data: computed(() => stateReactive.data),
    error: computed(() => stateReactive.error),
    params: computed(() => stateReactive.params),
    setState,
    rawState: state,
  }
}

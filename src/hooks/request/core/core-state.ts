import type { RequestOptions, RequestState } from '../types.ts'
import { computed, shallowReactive } from 'vue'

export default function useCoreState<
  // 数据
  TData = any,
  // 方法参数
  TParams extends any[] = any[],
  // dataSerializer 返回的数据类型
  TSerialized = TData,
  // 格式化数据
  TFormatData = TSerialized,
>(options: RequestOptions<TData, TParams, TSerialized, TFormatData>) {
  type State = RequestState<TData, TParams, TSerialized, TFormatData>

  const state: State = {
    data: options.initialData,
    rawData: undefined,
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
    rawData: computed(() => stateReactive.rawData),
    error: computed(() => stateReactive.error),
    params: computed(() => stateReactive.params),
    setState,
    rawState: state,
  }
}

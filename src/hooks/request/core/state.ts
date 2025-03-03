import type { RequestOptions, RequestState } from '../types.ts'
import { computed, shallowReactive } from 'vue'

export default function useRequestState<
  // 数据
  TData = any,
  // 方法参数
  TParams extends any[] = any[],
  // 格式化数据
  TFormatData = TData,
  // 原始数据
  TRawData = any,
>(options: RequestOptions<TData, TParams, TFormatData, TRawData>) {
  type State = RequestState<TData, TParams, TFormatData, TRawData>
  const state: State = {
    data: options.initialData,
    rawData: undefined,
    response: undefined,
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
    rawData: computed(() => stateReactive.response?.data),
    error: computed(() => stateReactive.error),
    response: computed(() => stateReactive.response),
    params: computed(() => stateReactive.params),
    setState,
    rawState: state,
  }
}

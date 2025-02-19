import type { InjectionKey } from 'vue'
import type { GlobalProvider } from './types.ts'
import { provide } from 'vue'

export const GLOBAL_PROVIDER_SYMBOL = Symbol('GlobalProvider') as InjectionKey<GlobalProvider<any, any>>

export function useGlobalProvider<
  // 数据
  TData = any,
  // 方法参数
  TParams extends any[] = any[],
  // 格式化数据
  TFormatData = TData,
  // 原始数据
  TRawData = any,
>(config: GlobalProvider<TData, TParams, TFormatData, TRawData>) {
  provide(GLOBAL_PROVIDER_SYMBOL, config)
}

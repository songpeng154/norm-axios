import type { InjectionKey } from 'vue'
import type { GlobalConfigProvider } from './types.ts'
import { provide } from 'vue'

export const GLOBAL_CONFIG_PROVIDER_SYMBOL = Symbol('GlobalProvider') as InjectionKey<GlobalConfigProvider<any, any>>

export function useGlobalConfigProvider<
  // 数据
  TData = any,
  // 方法参数
  TParams extends any[] = any[],
  // 格式化数据
  TFormatData = TData,
  // 原始数据
  TRawData = any,
>(config: GlobalConfigProvider<TData, TParams, TFormatData, TRawData>) {
  provide(GLOBAL_CONFIG_PROVIDER_SYMBOL, config)
}

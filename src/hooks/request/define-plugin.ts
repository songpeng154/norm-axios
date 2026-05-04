import type { RequestPluginImplement } from './types.ts'

function definePlugin<
  // 数据
  TData = any,
  // 方法参数
  TParams extends any[] = any[],
  TSerialized = TData,
  // 格式化数据
  TFormatData = TSerialized,
>(options: RequestPluginImplement<TData, TParams, TSerialized, TFormatData>) {
  return options
}

export default definePlugin

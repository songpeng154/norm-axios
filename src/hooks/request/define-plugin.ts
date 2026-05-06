import type { RequestPluginImplement } from './types.ts'

function definePlugin<
  // 数据
  TData = any,
  // 方法参数
  TParams extends any[] = any[],
  TSerialized = TData,
  // 格式化数据
  TFormatData = TSerialized,
  // 错误
  TError = any,
>(options: RequestPluginImplement<TData, TParams, TSerialized, TFormatData, TError>) {
  return options
}

export default definePlugin

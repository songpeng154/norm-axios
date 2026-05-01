import type { RequestPluginImplement } from './types.ts'

function definePlugin<
  // 数据
  TData = any,
  // 方法参数
  TParams extends any[] = any[],
  // 格式化数据
  TFormatData = TData,
>(options: RequestPluginImplement<TData, TParams, TFormatData>) {
  return options
}

export default definePlugin

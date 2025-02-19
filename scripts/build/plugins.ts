import type { PluginOptions } from 'vite-plugin-dts'
import { resolve } from 'node:path'
import dts from 'vite-plugin-dts'
import { ROOT_PATH } from './utils/paths.ts'

// 生成类型插件
export const dtsPlugin = (options: PluginOptions) => {
  return dts({
    // 输出路径 （输出到：dist/lib dist/es）
    // outDir: [UMD_BUNDLE_PATH],
    // 将 .vue.d.ts 转成 .d.ts
    cleanVueFileName: true,
    // tsconifg路径
    tsconfigPath: resolve(ROOT_PATH, 'tsconfig.json'),
    ...options,
  })
}

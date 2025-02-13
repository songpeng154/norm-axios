import type { PluginOption } from 'vite'
import type { PluginOptions } from 'vite-plugin-dts'
import { resolve } from 'node:path'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'
import { CJS_BUNDLE_PATH, ENTRANCE_PATH, ESM_BUNDLE_PATH, PACKAGES_PATH, ROOT_PATH } from './utils/paths.ts'

// 生成类型插件
const dtsPlugin = (options: PluginOptions) => {
  return dts({
    // 输出路径 （输出到：dist/lib dist/es）
    outDir: [CJS_BUNDLE_PATH, ESM_BUNDLE_PATH],
    // 将 .vue.d.ts 转成 .d.ts
    cleanVueFileName: true,
    // tsconifg路径
    tsconfigPath: resolve(ROOT_PATH, 'tsconfig.json'),
    ...options,
  })
}

/**
 * 插件集合
 * @param isGenerateTypeFile 是否生成ts类型文件
 */
export const plugins = (isGenerateTypeFile: boolean) => {
  const plugins: PluginOption[] = [
    // 解析 .vue 文件
    vue(),
    // cssInjectedByJsPlugin({
    //     jsAssetsFilterFunction: function customJsAssetsfilterFunction(outputChunk) {
    //         return outputChunk.fileName.includes('.vue')
    //     },
    // })
  ]

  isGenerateTypeFile && plugins.push(...[
    dtsPlugin({
      // 入口路径 packages
      entryRoot: PACKAGES_PATH,
      // 排除 packages/entrance
      exclude: [ENTRANCE_PATH],
    }),
    // 将 packages/entrance 下的类型生成到 dist/es 和 dist/lib下面
    dtsPlugin({
      // 入口路径 packages/entrance
      entryRoot: ENTRANCE_PATH,
    }),
  ])

  return plugins
}

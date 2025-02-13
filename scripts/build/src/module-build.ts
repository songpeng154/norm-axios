import type { OutputOptions } from 'rollup'
import glob from 'fast-glob'
import { build } from 'vite'
import { buildInfo, external } from './build-info.ts'
import { plugins } from './plugins.ts'
import excludeEmptyJsFiles from './rollup-plugins/exclude-empty-js-files.ts'
import { excludeFiles } from './utils'
import { ENTRANCE_PATH, PACKAGES_PATH } from './utils/paths.ts'

// 模块打包
export const moduleBuild = async (minify: boolean) => {
  const input = excludeFiles(await glob('**/*.{js,ts,vue}', {
    cwd: PACKAGES_PATH,
    absolute: true,
    onlyFiles: true,
  }))

  await build({
    plugins: plugins(true),
    build: {
      minify,
      lib: {
        entry: input,
      },
      cssMinify: true,
      cssCodeSplit: true,
      rollupOptions: {
        external,
        output: buildInfo.map((info) => {
          return {
            format: info.format,
            dir: info.dir,
            entryFileNames: info.entryFileNames,
            preserveModules: true,
            preserveModulesRoot: ENTRANCE_PATH,
            globals: {
              vue: 'Vue',
            },
          }
        }) as OutputOptions[],
        plugins: [
          // 排除空文件
          excludeEmptyJsFiles(),
        ],
      },
      emptyOutDir: true,
    },
  })
}

moduleBuild(false)

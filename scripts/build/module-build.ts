import { build } from 'vite'
import { external, outputGlobals } from './build-info.ts'
import { dtsPlugin } from './plugins.ts'
import excludeEmptyJsFiles from './rollup-plugins/exclude-empty-js-files.ts'
import { CJS_BUNDLE_PATH, ENTRANCE_PATH, ESM_BUNDLE_PATH, SRC_PATH } from './utils/paths.ts'

// 模块打包
export const moduleBuild = async (minify: boolean) => {
  await build({
    logLevel: 'silent',
    plugins: [
      dtsPlugin({
        outDir: [ESM_BUNDLE_PATH, CJS_BUNDLE_PATH],
        entryRoot: SRC_PATH,
        rollupTypes: true,
      }),
    ],
    build: {
      minify,
      lib: {
        entry: ENTRANCE_PATH,
      },
      rollupOptions: {
        external,
        output: [
          {
            format: 'cjs',
            dir: CJS_BUNDLE_PATH,
            entryFileNames: '[name].cjs',
            preserveModules: true,
            preserveModulesRoot: ENTRANCE_PATH,
            globals: outputGlobals,
          },
          {
            format: 'es',
            dir: ESM_BUNDLE_PATH,
            entryFileNames: '[name].mjs',
            preserveModules: true,
            preserveModulesRoot: ENTRANCE_PATH,
            globals: outputGlobals,
          },
        ],
        plugins: [
          // 排除空文件
          excludeEmptyJsFiles(),
        ],
      },
      emptyOutDir: true,
    },
  })
}

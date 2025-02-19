import { build } from 'vite'
import { external, outputGlobals } from './build-info.ts'
import { dtsPlugin } from './plugins.ts'
import { formatBundleFilename } from './utils'
import { DEFAULT_EXPORT, SRC_PATH, UMD_BUNDLE_PATH } from './utils/paths.ts'

/**
 * umd打包
 * @param minify 是否压缩
 */
export const umdBuild = async (minify: boolean) => {
  await build({
    plugins: [
      dtsPlugin({
        outDir: UMD_BUNDLE_PATH,
        entryRoot: SRC_PATH,
        rollupTypes: true,
      }),
    ],
    build: {
      minify,
      rollupOptions: {
        external,
        output: {
          format: 'umd',
          name: 'CovenFetch',
          dir: UMD_BUNDLE_PATH,
          entryFileNames: formatBundleFilename('index', minify, 'js'),
          globals: outputGlobals,
        },
      },
      lib: {
        entry: DEFAULT_EXPORT,
        name: 'CovenFetch',
        cssFileName: formatBundleFilename('index', minify),
      },
      emptyOutDir: true,
    },
  })
}

import { build } from 'vite'
import { external } from './build-info.ts'
import { plugins } from './plugins.ts'
import { formatBundleFilename } from './utils'
import { ALL_COMPONENTS_PATH, UMD_BUNDLE_PATH } from './utils/paths.ts'

/**
 * umd打包
 * @param minify 是否压缩
 */
const umdBuild = async (minify: boolean) => {
  await build({
    plugins: plugins(false),
    build: {
      minify,
      rollupOptions: {
        external,
        output: {
          format: 'umd',
          name: 'SurgeKit',
          dir: UMD_BUNDLE_PATH,
          entryFileNames: formatBundleFilename('index', minify, 'js'),
          globals: {
            vue: 'Vue',
          },
        },
      },
      lib: {
        entry: ALL_COMPONENTS_PATH,
        name: 'SurgeKit',
        cssFileName: formatBundleFilename('index', minify),
      },
      emptyOutDir: true,
    },
  })
}
umdBuild(true)
umdBuild(false)

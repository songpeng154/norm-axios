import type { AutoExternal, Dts } from '@rslib/core/dist-types/types/config'
import { defineConfig } from '@rslib/core'

const autoExternal: AutoExternal = {
  dependencies: false,
  optionalDependencies: true,
  peerDependencies: true,
  devDependencies: true,
}

const dts: Dts = {
  bundle: true,
}

export default defineConfig({
  lib: [
    {
      format: 'esm',
      autoExternal,
      output: {
        target: 'web',
        distPath: {
          root: './dist/esm',
        },
      },
      dts,
    },
    {
      format: 'cjs',
      autoExternal,
      output: {
        target: 'node',
        distPath: {
          root: './dist/cjs',
        },
      },
      dts,
    },
    {
      format: 'umd',
      umdName: 'NormAxios',
      output: {
        target: 'web',
        minify: true,
        distPath: {
          root: './dist/umd',
        },
        externals: {
          vue: 'Vue',
          axios: 'axios',
        },
      },
      dts,
    },
  ],
})

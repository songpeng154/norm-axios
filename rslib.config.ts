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
  output: {
    target: 'web',
  },
})

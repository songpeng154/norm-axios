import { defineConfig } from '@rslib/core'

export default defineConfig({
  lib: [
    {
      format: 'esm',
      output: {
        distPath: {
          root: './dist/esm',
        },
      },
      dts: {
        bundle: true,
      },
    },
    {
      format: 'cjs',
      output: {
        distPath: {
          root: './dist/cjs',
        },
      },
      dts: {
        bundle: true,
      },
    },
    {
      format: 'umd',
      umdName: 'NormAxios',
      autoExternal: true,
      output: {
        distPath: {
          root: './dist/umd',
        },
      },
      dts: {
        bundle: true,
      },
    },
  ],
  output: {
    minify: true,
  },
})

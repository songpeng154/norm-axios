import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['./src/index.ts'],
  format: ['cjs', 'esm'],
  outDir: 'dist',
  clean: true,
  minify: true,
  dts: true,
})

import { CJS_BUNDLE_PATH, ENTRANCE_PATH, ESM_BUNDLE_PATH } from './utils/paths.ts'

// 排除的包
export const external = ['vue']

// 输入配置
export const output = {
  entryFileNames: '[name].cjs',
  preserveModules: true,
  preserveModulesRoot: ENTRANCE_PATH,
  exports: 'named',
  globals: {
    vue: 'Vue',
  },
}

export const buildInfo = [
  {
    format: 'cjs',
    dir: CJS_BUNDLE_PATH,
    entryFileNames: '[name].cjs',
  },
  {
    format: 'es',
    dir: ESM_BUNDLE_PATH,
    entryFileNames: '[name].mjs',
  },
]

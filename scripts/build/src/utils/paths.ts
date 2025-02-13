import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

// 根路径
export const ROOT_PATH = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..', '..', '..')

// 项目路径
export const PACKAGES_PATH = resolve(ROOT_PATH, 'packages')

// 出口路径
export const ENTRANCE_PATH = resolve(PACKAGES_PATH, 'entrance')

// 全部组件路径
export const ALL_COMPONENTS_PATH = resolve(ENTRANCE_PATH, 'default.ts')

// 包路径
export const BUNDLE_PATH = resolve(ROOT_PATH, 'dist')

// UMD包路径
export const UMD_BUNDLE_PATH = resolve(BUNDLE_PATH, 'umd')

// CJS包路径
export const CJS_BUNDLE_PATH = resolve(BUNDLE_PATH, 'lib')

// ESM包路径
export const ESM_BUNDLE_PATH = resolve(BUNDLE_PATH, 'es')

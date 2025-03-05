import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

// 根路径
export const ROOT_PATH = resolve(dirname(fileURLToPath(import.meta.url)), '..')

// 包路径
export const BUNDLE_PATH = resolve(ROOT_PATH, 'dist')

// README
export const README_PATH = resolve(ROOT_PATH, 'README.md')

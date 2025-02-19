import { SRC_PATH } from './paths.ts'

/**
 * 格式化包文件名
 * @param name 名称
 * @param minify 是否压缩
 * @param suffix 后缀
 */
export const formatBundleFilename = (name: string, minify: boolean, suffix?: string) => `${name}${minify ? '.min' : ''}${suffix ? `.${suffix}` : ''}`

export const excludeFiles = (files: string[]) => {
  const excludes = ['node_modules', 'test', 'mock', 'gulpfile', 'dist']
  return files.filter((path) => {
    const position = path.startsWith(SRC_PATH) ? SRC_PATH.length : 0
    return !excludes.some(exclude => path.includes(exclude, position))
  })
}

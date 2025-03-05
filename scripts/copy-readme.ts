import { BUNDLE_PATH, README_PATH } from './path.ts'
import { copyFile } from './utils.ts'

export function copyReadme() {
  void copyFile(README_PATH, BUNDLE_PATH)
}

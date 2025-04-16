import { existsSync } from 'node:fs'
import { readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { BUNDLE_PATH } from './path.ts'

const folders = ['esm']
const injectContent = `
declare module 'axios' {
  interface AxiosRequestConfig extends Partial<Meta> {}
}
`

export const injectTsModule = async () => {
  for (const folder of folders) {
    const filePath = join(BUNDLE_PATH, folder, 'index.d.ts')

    if (existsSync(filePath)) {
      let content = await readFile(filePath, 'utf-8')

      if (!content.includes(injectContent.trim())) {
        content += injectContent
        await writeFile(filePath, content, 'utf-8')
        console.log(`✅ Injected into ${filePath}`)
      }
      else
        console.log(`⚠️  Already injected: ${filePath}`)
    }
    else
      console.warn(`❌ File not found: ${filePath}`)
  }
}

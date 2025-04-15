import { copyReadme } from './copy-readme.ts'
import { generatePackageJsonFile } from './generate-package.ts'
import { injectTsModule } from './inject-ts-module.ts'

generatePackageJsonFile()
copyReadme()
injectTsModule()

import { generatePackageJsonFile } from './generate-package.ts'
import { moduleBuild } from './module-build.ts'
import { umdBuild } from './umd-build.ts'

const build = async () => {
  await umdBuild(true)
  await umdBuild(false)
  await moduleBuild(true)
  await moduleBuild(false)

  generatePackageJsonFile()
}

build()

import * as fs from 'node:fs'
import { resolve } from 'node:path'
import { BUNDLE_PATH } from './utils/paths.ts'

const packageJson = {
  name: 'coven-fetch',
  version: '0.2.1',
  description: 'My Node.js Application',
  main: 'lib/index.js',
  module: 'es/index.js',
  types: 'es/index.d.ts',
  unpkg: 'umd/index.min.js',
  jsdelivr: 'umd/index.min.js',
  exports: {
    '.': {
      types: './es/index.d.ts',
      import: './es/index.mjs',
      require: './lib/index.cjs',
    },
  },
  keywords: ['axios', 'demo'],
  author: 'SongPeng <419626398@qq.com>',
  license: 'MIT',
  homepage: 'https://github.com/songpeng154/coven-fetch.git',
  repository: {
    type: 'git',
    url: 'https://github.com/songpeng154/coven-fetch.git',
  },
  bugs: {
    url: 'https://github.com/songpeng154/coven-fetch.gitt/issues',
  },
  dependencies: {
    '@vueuse/core': '^12.5.x',
    'es-toolkit': '^1.32.x',
  },
  peerDependencies: {
    vue: '^3.5.x',
    axios: '^1.7.x',
  },
}

export const generatePackageJsonFile = () => {
  fs.writeFileSync(resolve(BUNDLE_PATH, 'package.json'), JSON.stringify(packageJson, null, 2), 'utf8')
}

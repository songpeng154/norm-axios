import * as fs from 'node:fs'
import { resolve } from 'node:path'
import PackageInfo from '../package.json'
import { BUNDLE_PATH } from './path.ts'

const packageJson = {
  name: PackageInfo.name,
  version: PackageInfo.version,
  description: PackageInfo.description,
  type: 'module',
  main: 'cjs/index.cjs',
  module: 'esm/index.js',
  types: 'esm/index.d.ts',
  unpkg: 'umd/index.js',
  jsdelivr: 'umd/index.js',
  exports: {
    '.': {
      types: './esm/index.d.ts',
      import: './esm/index.js',
      require: './cjs/index.cjs',
    },
  },
  files: ['cjs', 'esm', 'umd'],
  keywords: [
    'axios',
    'vue-request',
    'ahooks',
    'vue-query',
    'react-query',
    '约定式请求',
    'norm-axios',
  ],
  author: 'SongPeng <419626398@qq.com>',
  license: 'MIT',
  homepage: 'https://github.com/songpeng154/norm-axios.git',
  repository: {
    type: 'git',
    url: 'https://github.com/songpeng154/norm-axios.git',
  },
  bugs: {
    url: 'https://github.com/songpeng154/norm-axios.gitt/issues',
  },
  dependencies: PackageInfo.dependencies,
  peerDependencies: PackageInfo.peerDependencies,
}

export function generatePackageJsonFile() {
  fs.writeFileSync(resolve(BUNDLE_PATH, 'package.json'), JSON.stringify(packageJson, null, 2), 'utf8')
}

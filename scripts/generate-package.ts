import * as fs from 'node:fs'
import { resolve } from 'node:path'
import { BUNDLE_PATH } from './path.ts'

const packageJson = {
  name: 'norm-axios',
  version: '1.0.0-beta.2',
  description: 'Norm Axios 是一个基于 Axios 的约定式请求库，提供了约定式的请求方式与强大的 Hook API，帮助你更高效的开发。',
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
  keywords: ['axios', 'vue', 'vue-request'],
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

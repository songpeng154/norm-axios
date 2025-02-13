// 打包的时候排除空 js 文件
const excludeEmptyJsFiles = () => ({
  name: 'exclude-empty-js-files',
  generateBundle(_: any, bundle: any) {
    for (const file in bundle)
      if (
        file.endsWith('.js')
        && !bundle[file].code.trim() // 如果文件为空
      )
        delete bundle[file] // 从打包结果中删除
  },
})

export default excludeEmptyJsFiles

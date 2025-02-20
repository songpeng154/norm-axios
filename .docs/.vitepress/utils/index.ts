export const getComponent = (moduleFiles: Record<string, any>, path: string) => {
  const key = Object.keys(moduleFiles).find(fileName => fileName.includes(path)) as string
  return moduleFiles[key]?.default
}

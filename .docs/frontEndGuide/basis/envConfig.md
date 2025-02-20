---
outline: deep
---

# 环境配置
本项目中的环境文件，需要其他的自行添加。
* `.env`：通用环境
* `.env.development`：开发环境
* `.env.production`：生产环境
* `.env.test`：测试环境

## 环境变量

```ts
declare interface ImportMetaEnv {
    // 端口
    readonly VITE_PORT: number

    // 网站标题
    readonly VITE_APP_TITLE: string

    // 资源公共路径
    readonly VITE_PUBLIC_PATH: string

    // 是否删除console
    readonly VITE_DELETE_CONSOLE: boolean

    // 配置多个服务,需要代理就写 "[前缀,Url]" 不需要就写 "api地址"
    readonly VITE_SERVICE_CONFIG: ServiceConfig

    // 是否开启fake
    readonly VITE_USE_FAKE: boolean

    // 是否开发工具
    readonly VITE_USE_DEV_TOOLS: boolean

    // 打包压缩类型
    readonly VITE_BUILD_COMPRESS: 'gzip' | 'brotliCompress' | 'deflate' | 'deflateRaw' | 'none'

    // 是否兼容旧版浏览器。开启后打包时间会慢一倍左右。会多打出旧浏览器兼容包,且会根据浏览器兼容性自动使用相应的版本
    readonly VITE_LEGACY: boolean
}
```

> 代码位置：`types/vite.d.ts`

### ServiceConfig

```ts
// 代理类型 0:前缀 1:url
declare type ProxyType = [ string, string ];

// 服务配置 (代理仅在开发模式有效)
declare interface ServiceConfig {
    // 数据模拟
    fake: string | ProxyType

    // 主服务
    main: string | ProxyType

    // 其他服务
    other: string | ProxyType
}
```
> 代码位置：`types/service/service.d.ts`

## 获取环境变量

`wrapperMetaEnv` 函数会将环境变量转成对应的类型。

```ts
const { VITE_PORT } = wrapperMetaEnv()
```

> 代码位置：`@/utils/env.ts`

## 设置环境变量
在 `.env`或者`.env.[环境模式]` 文件中设置环境变量

### `.env`通用环境
```.env 
# 网站标题
VITE_APP_TITLE = Simple Admin

# 端口
VITE_PORT = 8080
```

### `.env.development`开发环境
```.env.development
# 网站根目录
VITE_PUBLIC_PATH = /

# 是否开启fake
VITE_USE_FAKE = true

# 配置多个服务,需要代理就写 "[前缀,Url]" 不需要就写 "api地址" (代理仅在开发模式有效)
VITE_SERVICE_CONFIG = `{
  "fake": "/fake",

  "main": ["/dev", "http://localhost:3000"],

  "other": "http://localhost:3000"
}`

# 是否开启开发工具
VITE_USE_DEV_TOOLS = false
```

### `.env.production`生产环境
```.env.production
# 资源公共路径
VITE_PUBLIC_PATH = /

# 是否开启fake (不推荐在生产环境开启)
VITE_USE_FAKE = true

# 多服务配置
VITE_SERVICE_CONFIG = `{
  "fake": "/fake",

  "main": "/prod",

  "other": "http://localhost:3000"
}`

# 是否删除console
VITE_DELETE_CONSOLE = false

# 打包是否输出gz｜br文件
# 可选: 'gzip' | 'brotliCompress' | 'deflate' | 'deflateRaw' | 'none'
VITE_BUILD_COMPRESS = 'gzip'

# 是否兼容旧版浏览器。开启后打包时间会慢一倍左右。会多打出旧浏览器兼容包,且会根据浏览器兼容性自动使用相应的版本
VITE_LEGACY = false
```
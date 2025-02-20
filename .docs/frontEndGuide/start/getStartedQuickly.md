# 快速上手
## 环境准备
* [Git](https://git-scm.com/)：官网安装即可
* [Node](https://nodejs.org/zh-cn)：>= 18.0.0
* [Pnpm](https://pnpm.io/)：>= 8.6.0

## 代码获取

#### 从Github获取代码
```shell
git clone https://github.com/thikiiii/simple-admin.git
```
#### 从Gitee获取代码
```shell
git clone https://gitee.com/songpeng154/simple-admin.git
```
#### 依赖安装
```shell
pnpm i 
```

#### 启动项目
```shell
pnpm run dev
```

## 脚本命令
```json
{
  //  ...Other
  "scripts": {
    // 本地运行（开发环境）
    "dev": "vite --open",
    // 本地运行（测试环境）
    "dev:test": "vite --open --mode test",
    // 本地运行（生产环境）
    "dev:prod": "vite --open --mode production",
    // 打包项目（生产环境）
    "build": "vue-tsc --noEmit --skipLibCheck && vite build  --mode production",
    // 打包项目（测试环境）
    "build:test": "vue-tsc --noEmit --skipLibCheck && vite build --mode test",
    // 本地预览打包后的dist
    "preview": "vite preview --open --port 9999",
    // TS类型检查
    "type-check": "vue-tsc --noEmit --skipLibCheck",
    // Lint检查，并修复代码
    "lint": "eslint src --fix ",
    // Lint检查，并修复代码（只检查和修复当前修改的文件）
    "lint-staged": "lint-staged --no-stash",
    // 代码提交
    "commit": "git add . && git cz"
  }
  //  ...Other
}
```

## 目录结构
```text
.
├── .husky 
│  ├── _                         // husky自动生成的文件
│  └── pre-commit                // 代码提交之前的钩子
├── build                        // vite 构建相关配置和插件
│  ├── deploy                    // vite 配置
│  │  ├── plugins.ts             // vite 插件配置
│  │  └── proxy.ts               // vite 网络请求配置
│  └── utils.ts                  // vite 工具函数
├── fake                         // 接口数据模拟
├── public                       // 公共目录(文件夹里面的资源打包后会在根目录下)
├── src                          // 源代码
│  ├── assets                    // 静态资源
│  │  ├── iconify.ts             // 图标集(用于图标选择器和菜单图标)
│  │  ├── images                 // 图片文件目录
│  │  ├── styles                 // 样式
│  │  │  ├── animation           // 动画样式
│  │  │  ├── antd                // ant-design-vue 组件样式覆盖
│  │  │  ├── index.scss          // 样式入口文件
│  │  │  └── initialize.scss     // 初始样式
│  │  ├── svg                    // svg文件目录
│  │  └── index.js               // 静态资源入口文件
│  ├── components                // 全局组件
│  │  ├── antd                   // ant-design-vue 组件二次封装 
│  │  ├── common                 // 通用组件
│  │  └── index.js               // 全局组件入口文件
│  ├── config                    // 全局配置
│  │  ├── app.ts                 // app配置
│  │  ├── hint.ts                // 提示配置
│  │  ├── map.ts                 // 地图配置 
│  │  ├── router.ts              // 路由配置 
│  │  └── services.ts            // 服务配置 
│  ├── enums                     // 枚举
│  ├── hooks                     // 组合式的函数hooks
│  │  ├── common                 // 通用hook
│  │  ├── components             // hook式组件
│  │  ├── effect                 // 副作用 
│  │  └── service                // 服务
│  ├── layout                    // 布局
│  ├── router                    // 路由
│  │  ├── modules                // 路由模块
│  │  ├── routes                 // 静态路由
│  │  ├── utils                  // 路由工具 
│  │  │  ├── guard.ts            // 路由守卫 
│  │  │  └── tool.ts             // 路由工具类 
│  │  └── index.ts               // 路由入口文件
│  ├── services                  // 服务
│  │  ├── api                    // api接口
│  │  └── request                // 封装的请求函数 
│  │  │  ├── axios               // axios 二次封装 
│  │  │  ├── serves              // 服务模块 
│  │  │  └── utils               // 服务工具
│  ├── store                     // 状态和本地缓存
│  │  ├── modules                // Pinia状态模块 
│  │  │  ├── app                 // app状态 
│  │  │  ├── auth                // 授权状态 
│  │  │  └── tabBar              // tab栏状态
│  │  ├── caches                 // 本地缓存
│  │  └── index                  // 状态和本地缓存入口文件 
│  ├── utils                     // 全局工具
│  │  ├── cache                  // 缓存工具
│  │  ├── day                    // 时间工具
│  │  ├── env                    // 环境工具
│  │  ├── plugin                 // vue插件
│  │  ├── regular                // 正则工具
│  │  └── index                  // 全局工具入口文件 
│  ├── views                     // 页面
│  ├── App.vue                   // 入口组件
│  └── main.ts                   // 入口文件
├── types                        // 类型
│  ├── service                   // 服务类型
│  │  ├── model                  // 服务模型(对应后台响应的数据结构)
│  │  ├── axios.d.ts             // axios模块
│  │  └── common.d.ts            // 通用服务类型
│  ├── store                     // 状态类型
│  │  ├── app.d.ts               // app状态类型
│  │  ├── auth.d.ts              // 授权状态类型
│  │  └── tabBar.d.ts            // 标签栏状态类型
│  ├── auto-imports.d.ts         // 自动导入类型
│  ├── components.d.ts           // 组件自动导入类型
│  ├── global.d.ts               // 全局类型
│  ├── route.d.ts                // 路由类型
│  ├── router.d.ts               // 路由器模块 
│  ├── theme.d.ts                // 主题类型
│  ├── vite.d.ts                 // vite类型
│  ├── vue.d.ts                  // vue模块
│  └── vue-query.ts              // vue-query模块
├── .env                         // 通用环境文件
├── .env.development             // 开发环境文件
├── .env.production              // 生产环境文件
├── .env.test                    // 测试环境文件
├── .gitignore                   // git提交忽略文件
├── .npmrc                       // npm配置文件
├── commitlint.config.cjs        // 代码提交校验配置文件
├── eslint.config.js             // eslint配置文件
├── index.html                   // 项目入口index.html
├── package.json                 // package
├── pnpm-lock.yaml               // pnpm依赖锁定文件
├── README.md                    // 项目描述文档
├── tsconfig.json                // typeScript配置
├── uno.config.ts                // unocss配置
└── vite.config.ts               // vite配置
```
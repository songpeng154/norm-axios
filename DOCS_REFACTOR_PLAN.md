# Vue Rex 文档重构计划

## 一、项目概述

### 1.1 当前状态

vue-rex 已经完成代码重构，采用工厂函数模式（`createRequest`、`createPagination`），但文档仍然是旧版 API（`useRequest` 直接调用、`[data, error]` 返回格式）。

### 1.2 重构目标

- 更新文档内容，适配新的 API
- 支持中英文双语
- 使用 VitePress i18n 实现语言切换
- 保持文档结构清晰，易于维护

---

## 二、文档结构设计

### 2.1 目录结构

```
docs/
├── .vitepress/
│   ├── config.mts              # VitePress 配置（含 i18n）
│   ├── examples/               # Demo 文件
│   │   ├── use-request/        # use-request 示例（27 个 .vue 文件）
│   │   └── use-pagination/     # use-pagination 示例（3 个 .vue 文件）
│   ├── components/             # 自定义组件
│   ├── theme/                  # 主题配置
│   └── container/              # 容器配置
├── document/                   # 中文文档
│   ├── start/
│   │   ├── introduction.md     # 介绍
│   │   └── start-quickly.md    # 快速开始
│   ├── use-request/
│   │   ├── introduction.md     # use-request 介绍
│   │   ├── basic-usage.md      # 基础用法
│   │   ├── loading.md          # Loading 状态
│   │   ├── debounce.md         # 防抖
│   │   ├── throttle.md         # 节流
│   │   ├── cache-swr.md        # 缓存 & SWR
│   │   ├── data-mutation.md    # 数据突变
│   │   ├── error-retry.md      # 错误重试
│   │   ├── dependency-refresh.md # 依赖刷新
│   │   ├── polling-request.md  # 轮询请求
│   │   ├── dependency-request.md # 依赖请求
│   │   ├── parallel-request.md # 并行请求
│   │   ├── cancel-request.md   # 取消请求
│   │   ├── formatting-data.md  # 格式化数据
│   │   └── refresh-on-window-focus.md # 窗口聚焦刷新
│   ├── use-pagination/
│   │   └── introduction.md     # use-pagination 介绍
│   └── global-config.md        # 全局配置
├── en/                         # 英文文档（镜像中文结构）
│   ├── start/
│   │   ├── introduction.md
│   │   └── start-quickly.md
│   ├── use-request/
│   │   ├── introduction.md
│   │   ├── basic-usage.md
│   │   └── ... (其他文件)
│   ├── use-pagination/
│   │   └── introduction.md
│   └── global-config.md
├── api-reference/              # API 参考（中文）
│   ├── common-type/
│   │   ├── home.md
│   │   ├── response-content.md
│   │   └── response-error.md
│   └── hooks/
│       ├── use-request/
│       │   ├── home.md
│       │   ├── request-options.md
│       │   ├── request-result.md
│       │   ├── request-state.md
│       │   ├── request-method.md
│       │   ├── request-service-fn.md
│       │   ├── request-plugin-implement.md
│       │   ├── request-plugin-hooks.md
│       │   ├── request-context.md
│       │   └── cached-data.md
│       └── use-pagination/
│           ├── home.md
│           ├── pagination-options.md
│           ├── pagination-response.md
│           └── pagination-and-fetch-options.md
├── en-api-reference/           # API 参考（英文，镜像中文结构）
├── public/                     # 静态资源
├── index.md                    # 首页
├── contact.md                  # 联系作者
└── package.json
```

### 2.2 文件统计

| 类型 | 数量 | 说明 |
|------|------|------|
| 中文文档 (.md) | 42 | 现有文件 |
| 英文文档 (.md) | 25+ | 新增 |
| Demo 文件 (.vue) | 32 | 需要更新 |
| API 参考 (.md) | 17 | 需要更新 |
| **总计** | **~116** | |

---

## 三、VitePress i18n 配置

### 3.1 配置文件

**文件：** `docs/.vitepress/config.mts`

```ts
import UnoCSS from 'unocss/vite'
import { defineConfig } from 'vitepress'
import { setupContainerDemo } from './container/demo'

export default defineConfig({
  // 共享配置
  cleanUrls: true,
  markdown: {
    theme: {
      dark: 'github-dark',
      light: 'github-light',
    },
    async config(md) {
      setupContainerDemo(md)
    },
    lineNumbers: true,
  },
  vite: {
    server: {
      hmr: true,
    },
    plugins: [
      UnoCSS(),
    ],
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler',
        },
      },
    },
  },

  // i18n 配置
  locales: {
    root: {
      label: '简体中文',
      lang: 'zh-CN',
      title: 'Vue Rex 使用文档',
      description: 'Vue Rex 是一个面向 Vue 3 的高度灵活、类型安全且插件化的请求 Hook 库',
      themeConfig: {
        nav: [
          { text: '文档', link: '/document/start/introduction', activeMatch: '^/document/' },
          { text: 'API参考', link: '/api-reference/common-type/home', activeMatch: '^/api-reference/' },
          { text: '联系作者', link: '/contact' },
        ],
        sidebar: {
          '/document': [
            {
              text: '开始',
              base: '/document/start',
              items: [
                { text: '介绍', link: '/introduction' },
                { text: '快速上手', link: '/start-quickly' },
              ],
            },
            { text: '全局配置', link: '/document/global-config' },
            {
              text: 'createRequest',
              base: '/document/use-request',
              items: [
                { text: '介绍', link: '/introduction' },
                { text: '基础用法', link: '/basic-usage' },
                { text: 'Loading 状态', link: '/loading' },
                { text: '防抖', link: '/debounce' },
                { text: '节流', link: '/throttle' },
                { text: '缓存 & SWR', link: '/cache-swr' },
                { text: '数据突变', link: '/data-mutation' },
                { text: '错误重试', link: '/error-retry' },
                { text: '依赖刷新', link: '/dependency-refresh' },
                { text: '轮询请求', link: '/polling-request' },
                { text: '依赖请求', link: '/dependency-request' },
                { text: '并行请求', link: '/parallel-request' },
                { text: '取消请求', link: '/cancel-request' },
                { text: '格式化数据', link: '/formatting-data' },
                { text: '窗口聚焦刷新', link: '/refresh-on-window-focus' },
              ],
            },
            {
              text: 'createPagination',
              base: '/document/use-pagination',
              items: [
                { text: '介绍', link: '/introduction' },
              ],
            },
          ],
          '/api-reference': [
            { text: '通用类型', link: '/api-reference/common-type/home' },
            {
              text: 'Hooks',
              base: '/api-reference/hooks',
              items: [
                { text: 'createRequest', link: '/use-request/home' },
                { text: 'createPagination', link: '/use-pagination/home' },
              ],
            },
          ],
        },
      },
    },
    en: {
      label: 'English',
      lang: 'en',
      title: 'Vue Rex Documentation',
      description: 'Vue Rex is a flexible, type-safe, and plugin-based request Hook library for Vue 3',
      themeConfig: {
        nav: [
          { text: 'Docs', link: '/en/document/start/introduction', activeMatch: '^/en/document/' },
          { text: 'API Reference', link: '/en/api-reference/common-type/home', activeMatch: '^/en/api-reference/' },
          { text: 'Contact', link: '/en/contact' },
        ],
        sidebar: {
          '/en/document': [
            {
              text: 'Getting Started',
              base: '/en/document/start',
              items: [
                { text: 'Introduction', link: '/introduction' },
                { text: 'Quick Start', link: '/start-quickly' },
              ],
            },
            { text: 'Global Config', link: '/en/document/global-config' },
            {
              text: 'createRequest',
              base: '/en/document/use-request',
              items: [
                { text: 'Introduction', link: '/introduction' },
                { text: 'Basic Usage', link: '/basic-usage' },
                { text: 'Loading', link: '/loading' },
                { text: 'Debounce', link: '/debounce' },
                { text: 'Throttle', link: '/throttle' },
                { text: 'Cache & SWR', link: '/cache-swr' },
                { text: 'Data Mutation', link: '/data-mutation' },
                { text: 'Error Retry', link: '/error-retry' },
                { text: 'Dependency Refresh', link: '/dependency-refresh' },
                { text: 'Polling', link: '/polling-request' },
                { text: 'Dependency Request', link: '/dependency-request' },
                { text: 'Parallel Request', link: '/parallel-request' },
                { text: 'Cancel Request', link: '/cancel-request' },
                { text: 'Format Data', link: '/formatting-data' },
                { text: 'Refresh on Window Focus', link: '/refresh-on-window-focus' },
              ],
            },
            {
              text: 'createPagination',
              base: '/en/document/use-pagination',
              items: [
                { text: 'Introduction', link: '/introduction' },
              ],
            },
          ],
          '/en/api-reference': [
            { text: 'Common Types', link: '/en/api-reference/common-type/home' },
            {
              text: 'Hooks',
              base: '/en/api-reference/hooks',
              items: [
                { text: 'createRequest', link: '/use-request/home' },
                { text: 'createPagination', link: '/use-pagination/home' },
              ],
            },
          ],
        },
      },
    },
  },

  // 共享主题配置
  themeConfig: {
    logo: '/assets/images/logo.png',
    darkModeSwitchLabel: '主题',
    darkModeSwitchTitle: '切换到深色模式',
    lightModeSwitchTitle: '切换到浅色模式',
    returnToTopLabel: '回到顶部',
    langMenuLabel: '切换语言',
    sidebarMenuLabel: '目录',
    skipToContentLabel: '跳转到内容',
    socialLinks: [
      { icon: 'github', link: 'https://github.com/songpeng154/vue-rex.git' },
    ],
  },
})
```

---

## 四、文档内容更新

### 4.1 基础文档更新

#### 4.1.1 `document/start/introduction.md`

**更新内容：**
- 更新核心特性介绍（工厂函数模式、类型自动推导）
- 更新架构图
- 更新代码示例

**新内容示例：**
```markdown
# 介绍

`Vue Rex` 是一个专为 Vue 3 设计的高度灵活、类型安全且插件化的请求 Hook 库。

## 核心特性

- **工厂函数模式**：通过 `createRequest` / `createPagination` 创建可复用的请求实例
- **类型自动推导**：TypeScript 根据 service 返回类型自动推导 data 类型
- **多后端适配**：通过 `dataKey` / `listKey` + `totalKey` 统一不同后端的数据结构
- **缓存策略**：内置内存缓存，支持 SWR（Stale-While-Revalidate）
- **轮询请求**：自动定时重新请求
- **错误重试**：支持配置重试次数和间隔
- **防抖 / 节流**：内置请求防抖和节流
- **分页管理**：自动管理 page / pageSize 状态
- **插件化**：支持自定义插件扩展
- **全局配置**：支持全局默认配置和插件注入

## 快速示例

```ts
import { createRequest } from 'vue-rex'

// 创建实例，dataKey 指定数据提取路径
const useApi = createRequest({ dataKey: 'data' })

// 组件中使用
const { data, loading, error, run } = useApi(getUserList)
// data.value 自动推导为 User[] 类型 ✅
```
```

#### 4.1.2 `document/start/start-quickly.md`

**更新内容：**
- 更新安装说明
- 更新快速开始示例（使用 createRequest）
- 更新 CDN 引入方式

**新内容示例：**
```markdown
# 快速开始

## 安装

::: code-group

```bash [npm]
npm install vue-rex
```

```bash [pnpm]
pnpm add vue-rex
```

:::

## 基本用法

```vue
<script setup lang="ts">
import { createRequest } from 'vue-rex'

const useApi = createRequest({ dataKey: 'data' })

const getUserList = async () => {
  const res = await fetch('/api/users')
  return res.json()
}

const { data, loading, error } = useApi(getUserList)
</script>

<template>
  <div>
    <div v-if="loading">加载中...</div>
    <div v-if="error">错误：{{ error.message }}</div>
    <div v-if="data">
      <div v-for="user in data" :key="user.id">
        {{ user.name }}
      </div>
    </div>
  </div>
</template>
```
```

### 4.2 use-request 文档更新

#### 4.2.1 `document/use-request/introduction.md`

**更新内容：**
- 介绍 createRequest 工厂函数
- 介绍 useRequest 直接调用
- 对比两种用法

**新内容示例：**
```markdown
# createRequest 介绍

`createRequest` 是一个工厂函数，用于创建绑定了数据提取逻辑的请求实例。

## 基本用法

```ts
import { createRequest } from 'vue-rex'

// 创建实例
const useApi = createRequest({ dataKey: 'data' })

// 组件中使用
const { data, loading, error, run } = useApi(getUserList)
```

## 配置选项

### dataKey

数据字段路径，支持点号嵌套。

```ts
// 提取 res.data
const useApi = createRequest({ dataKey: 'data' })

// 提取 res.result.data
const useApi = createRequest({ dataKey: 'result.data' })

// 提取 res.data.attributes
const useApi = createRequest({ dataKey: 'data.attributes' })
```

### options

全局默认配置，会被调用时的 options 覆盖。

```ts
const useApi = createRequest({
  dataKey: 'data',
  options: {
    refreshOnWindowFocus: true,
    debounceWait: 300,
  }
})
```
```

#### 4.2.2 `document/use-request/basic-usage.md`

**更新内容：**
- 更新基础用法示例（使用 createRequest）
- 更新响应式状态说明
- 更新手动触发示例

**新内容示例：**
```markdown
# 基础用法

## 默认请求

组件初始化时会自动执行。

```vue
<script setup lang="ts">
import { createRequest } from 'vue-rex'

const useApi = createRequest({ dataKey: 'data' })

const getUserList = async () => {
  const res = await fetch('/api/users')
  return res.json()
}

const { data, loading, error } = useApi(getUserList)
</script>
```

## 响应式状态

- `data`：service 返回的数据（经过 dataKey 提取）
- `error`：service 返回的错误信息
- `loading`：当前是否正在请求中
- `params`：当前请求所使用的参数数组
- `finished`：请求是否已经完成

## 手动触发

```ts
const useApi = createRequest({ dataKey: 'data' })

const { run, loading } = useApi(service, { manual: true })

// 点击按钮时触发
const handleClick = () => {
  run('some params')
}
```
```

### 4.3 其他 use-request 文档更新

每个文档文件都需要更新：
- 代码示例（使用 createRequest）
- API 说明
- 类型定义

**需要更新的文件：**
1. `loading.md` - Loading 状态
2. `debounce.md` - 防抖
3. `throttle.md` - 节流
4. `cache-swr.md` - 缓存 & SWR
5. `data-mutation.md` - 数据突变
6. `error-retry.md` - 错误重试
7. `dependency-refresh.md` - 依赖刷新
8. `polling-request.md` - 轮询请求
9. `dependency-request.md` - 依赖请求
10. `parallel-request.md` - 并行请求
11. `cancel-request.md` - 取消请求
12. `formatting-data.md` - 格式化数据
13. `refresh-on-window-focus.md` - 窗口聚焦刷新

### 4.4 use-pagination 文档更新

**文件：** `document/use-pagination/introduction.md`

**更新内容：**
- 介绍 createPagination 工厂函数
- 更新代码示例
- 更新 API 说明

**新内容示例：**
```markdown
# createPagination 介绍

`createPagination` 是一个工厂函数，用于创建绑定了数据提取逻辑的分页实例。

## 基本用法

```ts
import { createPagination } from 'vue-rex'

// 创建分页实例
const usePage = createPagination({
  listKey: 'data.records',
  totalKey: 'data.total',
})

// 组件中使用
const getUserPage = async (params: { page: number; pageSize: number }) => {
  const res = await fetch(`/api/users?page=${params.page}&size=${params.pageSize}`)
  return res.json()
}

const { list, total, page, pageSize, run } = usePage(getUserPage)
```

## 配置选项

### listKey

列表字段路径，支持点号嵌套。

```ts
// 提取 res.data.records
const usePage = createPagination({
  listKey: 'data.records',
  totalKey: 'data.total',
})
```

### totalKey

总条数字段路径，支持点号嵌套。

```ts
// 提取 res.data.total
const usePage = createPagination({
  listKey: 'data.records',
  totalKey: 'data.total',
})
```

### paginationSerializer

分页参数序列化，用于适配后端不同的字段名。

```ts
const usePage = createPagination({
  listKey: 'data.records',
  totalKey: 'data.total',
  paginationSerializer: (page, pageSize) => ({
    current: page,
    size: pageSize,
  }),
})
```
```

---

## 五、Demo 文件更新

### 5.1 Demo 文件列表

**use-request 示例（27 个）：**
1. `basic-usage.vue` - 基础用法
2. `manual-execution.vue` - 手动执行
3. `default-params.vue` - 默认参数
4. `refresh.vue` - 刷新
5. `initial-data.vue` - 初始数据
6. `loading-delay.vue` - Loading 延迟
7. `loading-keep.vue` - Loading 保持
8. `debounce.vue` - 防抖
9. `throttle.vue` - 节流
10. `cache-stale.vue` - 缓存过期
11. `customize-cache.vue` - 自定义缓存
12. `clear-cache.vue` - 清除缓存
13. `swr.vue` - SWR
14. `data-sharing.vue` - 数据共享
15. `mutate.vue` - 数据突变
16. `optimistic-update.vue` - 乐观更新
17. `error-retry.vue` - 错误重试
18. `dependency-refresh.vue` - 依赖刷新
19. `auto-collect-dependency.vue` - 自动收集依赖
20. `dependency-request.vue` - 依赖请求
21. `parallel-request.vue` - 并行请求
22. `polling-request.vue` - 轮询请求
23. `polling-request-error-retry.vue` - 轮询请求错误重试
24. `cancel-request.vue` - 取消请求
25. `formatting-data.vue` - 格式化数据
26. `life-cycle.vue` - 生命周期
27. `refresh-on-window-focus.vue` - 窗口聚焦刷新

**use-pagination 示例（3 个）：**
1. `base.vue` - 基础用法
2. `added-mode.vue` - 追加模式
3. `target.vue` - 滚动监听

### 5.2 Demo 文件模板

**新 demo 文件示例：**

```vue
<script setup lang="ts">
import { createRequest } from 'vue-rex'

const useApi = createRequest({ dataKey: 'data' })

interface User {
  id: number
  name: string
  email: string
}

const getUserList = async (): Promise<{ code: number; data: User[] }> => {
  const res = await fetch('/api/users')
  return res.json()
}

const { data, loading, error } = useApi(getUserList)
</script>

<template>
  <div>
    <div v-if="loading">加载中...</div>
    <div v-if="error">错误：{{ error.message }}</div>
    <div v-if="data">
      <div v-for="user in data" :key="user.id">
        {{ user.name }} - {{ user.email }}
      </div>
    </div>
  </div>
</template>
```

---

## 六、API 参考更新

### 6.1 通用类型（3 个文件）

1. `common-type/home.md` - 通用类型首页
2. `common-type/response-content.md` - ResponseContent 类型
3. `common-type/response-error.md` - ResponseError 类型

### 6.2 use-request API（10 个文件）

1. `use-request/home.md` - createRequest API 首页
2. `use-request/request-options.md` - RequestOptions 类型
3. `use-request/request-result.md` - RequestResult 类型
4. `use-request/request-state.md` - RequestState 类型
5. `use-request/request-method.md` - RequestMethod 类型
6. `use-request/request-service-fn.md` - RequestServiceFn 类型
7. `use-request/request-plugin-implement.md` - RequestPluginImplement 类型
8. `use-request/request-plugin-hooks.md` - RequestPluginHooks 类型
9. `use-request/request-context.md` - RequestContext 类型
10. `use-request/cached-data.md` - CachedData 类型

### 6.3 use-pagination API（4 个文件）

1. `use-pagination/home.md` - createPagination API 首页
2. `use-pagination/pagination-options.md` - PaginationOptions 类型
3. `use-pagination/pagination-response.md` - PaginationResult 类型
4. `use-pagination/pagination-and-fetch-options.md` - 分页配置选项

---

## 七、英文文档创建

### 7.1 目录结构

```
docs/en/
├── start/
│   ├── introduction.md
│   └── start-quickly.md
├── use-request/
│   ├── introduction.md
│   ├── basic-usage.md
│   ├── loading.md
│   ├── debounce.md
│   ├── throttle.md
│   ├── cache-swr.md
│   ├── data-mutation.md
│   ├── error-retry.md
│   ├── dependency-refresh.md
│   ├── polling-request.md
│   ├── dependency-request.md
│   ├── parallel-request.md
│   ├── cancel-request.md
│   ├── formatting-data.md
│   └── refresh-on-window-focus.md
├── use-pagination/
│   └── introduction.md
└── global-config.md
```

### 7.2 翻译方式

- 使用 AI 翻译（ChatGPT / Claude）
- 人工校对专业术语
- 保持代码示例不变
- 保持文档结构一致

---

## 八、部署配置

### 8.1 GitHub Action

**文件：** `.github/workflows/deploy-docs.yml`

```yaml
name: Deploy Docs

on:
  push:
    branches:
      - main
    paths:
      - 'docs/**'
      - 'packages/vue-rex/src/**'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install pnpm
        uses: pnpm/action-setup@v4
        with:
          version: 10

      - name: Install dependencies
        run: pnpm install

      - name: Build vue-rex
        run: pnpm run build

      - name: Build docs
        run: pnpm run doc:build

      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: docs/.vitepress/dist
```

### 8.2 Cloudflare Pages

在 Cloudflare Pages 中配置：
- 构建命令：`pnpm run doc:build`
- 输出目录：`docs/.vitepress/dist`
- 环境变量：`NODE_VERSION=20`

---

## 九、执行计划

### 阶段 1：配置 VitePress i18n（1 天）

- [ ] 更新 `docs/.vitepress/config.mts`
- [ ] 配置中英文语言切换
- [ ] 配置中英文侧边栏
- [ ] 测试语言切换功能

### 阶段 2：更新基础文档（1 天）

- [ ] 更新 `document/start/introduction.md`
- [ ] 更新 `document/start/start-quickly.md`
- [ ] 更新 `document/global-config.md`

### 阶段 3：更新 use-request 文档（3 天）

- [ ] 更新 `document/use-request/introduction.md`
- [ ] 更新 `document/use-request/basic-usage.md`
- [ ] 更新其他 13 个功能文档
- [ ] 更新所有 demo 文件（27 个）

### 阶段 4：更新 use-pagination 文档（1 天）

- [ ] 更新 `document/use-pagination/introduction.md`
- [ ] 更新 demo 文件（3 个）

### 阶段 5：更新 API 参考（2 天）

- [ ] 更新通用类型文档（3 个）
- [ ] 更新 use-request API 文档（10 个）
- [ ] 更新 use-pagination API 文档（4 个）

### 阶段 6：创建英文文档（3 天）

- [ ] 翻译基础文档
- [ ] 翻译 use-request 文档
- [ ] 翻译 use-pagination 文档
- [ ] 翻译 API 参考文档

### 阶段 7：配置部署（1 天）

- [ ] 创建 GitHub Action
- [ ] 配置 Cloudflare Pages
- [ ] 配置 GitHub Pages
- [ ] 测试部署

### 总计：约 12 天

---

## 十、风险评估

| 风险 | 等级 | 说明 |
|------|------|------|
| 配置 VitePress i18n | 低 | VitePress 原生支持 |
| 翻译质量 | 中 | 需要人工校对 |
| Demo 文件更新 | 中 | 需要测试确保正常运行 |
| 部署配置 | 中 | 需要配置 CI/CD |
| 文档维护 | 低 | 结构清晰，易于维护 |

---

## 十一、验证清单

- [ ] `pnpm run doc` 能正常启动
- [ ] 中英文切换正常
- [ ] 所有 demo 能正常运行
- [ ] 文档链接正确
- [ ] 类型推导正确
- [ ] 部署成功
- [ ] 移动端显示正常
- [ ] 搜索功能正常

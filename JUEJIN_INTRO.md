# Vue Rex：一个更简单的 Vue 3 请求库

## 它解决什么问题

在 Vue 3 项目里，我们经常要写这样的代码：

```ts
const loading = ref(false)
const data = ref<User | null>(null)

const fetchUser = async () => {
  loading.value = true
  try {
    const res = await getUser()
    data.value = res.data  // 每次都要手动提取
  } finally {
    loading.value = false
  }
}
onMounted(fetchUser)
```

每个接口都要重复这套逻辑：管理 loading、提取数据、处理错误。写多了就会想，能不能把这些重复的东西抽出来？

假设你的后端返回这样的结构：

```json
{
  "code": 0,
  "data": { "id": 1, "name": "张三" },
  "message": "success"
}
```

用 Vue Rex 的话：

```ts
const useApi = createRequest({ dataKey: 'data' })

const { data, loading } = useApi(getUser)
// data.value 直接就是 User 类型，不用手动提取，类型也自动推导好了
```

Vue Rex 主要解决三个问题：

1. **自动提取数据**：配置一次 `dataKey`，所有请求自动提取对应字段
2. **类型自动推导**：根据 service 函数返回类型自动推导 data 类型，不需要手动标注泛型
3. **统一配置**：通过工厂函数创建请求实例，全局共享配置

## 安装

```bash
npm install vue-rex
# or
pnpm add vue-rex
```

## 推荐的项目结构

### 第一步：定义 API 层

```ts
// api/user.ts
import axios from 'axios'

// 后端统一返回格式
interface ApiResponse<T> {
  code: number
  data: T
  message: string
}

// 用户类型
export interface User {
  id: number
  name: string
  email: string
}

// API 函数
export const getUser = (id: number) =>
  axios.get<ApiResponse<User>>(`/api/user/${id}`).then(res => res.data)

export const getUserList = () =>
  axios.get<ApiResponse<User[]>>('/api/users').then(res => res.data)
```

### 第二步：创建 Hooks 层

```ts
// hooks/useApi.ts
import { createRequest, createPagination } from 'vue-rex'

// 创建请求实例
export const useApi = createRequest({
  dataKey: 'data',
  options: {
    errorRetryCount: 2,
    cacheTime: 5 * 60 * 1000
  }
})

// 创建分页实例
export const usePage = createPagination({
  listKey: 'data.list',
  totalKey: 'data.total'
})
```

### 第三步：在组件中使用

```vue
<script setup lang="ts">
import { useApi } from '@/hooks/useApi'
import { getUser, getUserList } from '@/api/user'

// 获取单个用户
const { data: user, loading, error, refresh } = useApi(() => getUser(1))
// user 的类型是 Ref<User | undefined>

// 获取用户列表（带缓存）
const { data: users } = useApi(getUserList, {
  cacheKey: 'user-list',
  staleTime: 5000
})
</script>

<template>
  <div v-if="loading">加载中...</div>
  <div v-else-if="error">错误：{{ error.message }}</div>
  <div v-else-if="user">
    <h1>{{ user.name }}</h1>
    <p>{{ user.email }}</p>
    <button @click="refresh">刷新</button>
  </div>
</template>
```

## 核心功能详解

### 自动提取数据 + 类型推导

配置一次 `dataKey`，之后所有请求都会自动提取对应字段，而且 TypeScript 类型也会自动推导：

```ts
interface ApiResponse<T> {
  code: number
  data: T
  message: string
}

interface User {
  id: number
  name: string
}

const getUser = async (): Promise<ApiResponse<User>> => {
  return fetch('/api/user').then(res => res.json())
}

const useApi = createRequest({ dataKey: 'data' })
const { data } = useApi(getUser)
// data 的类型是 Ref<User | undefined>，不需要你手动写泛型
```

支持深层路径，比如后端返回 `{ code: 0, result: { data: { list: [...] } } }`：

```ts
const useApi = createRequest({ dataKey: 'result.data.list' })
const { data } = useApi(getUserList)
// data 直接就是 User[] 类型
```

### 错误处理

Vue Rex 的 `error` 来自 service 抛出的 reject。推荐在 axios 拦截器里统一处理业务异常：

```ts
// axios 响应拦截器
server.interceptors.response.use(
  (res) => {
    // 业务错误码处理
    if (res.data.code !== 0) {
      return Promise.reject(res.data.message)
    }
    return res.data
  },
  (err) => {
    // 网络错误处理
    return Promise.reject(err)
  }
)
```

这样 service 成功时直接返回数据，失败时抛出 reject，Vue Rex 的 `error` 会自动捕获：

```ts
const { data, error } = useApi(getUser)
// error.value 是拦截器 reject 的值
```

**自定义错误类型**

如果你想统一错误的数据结构，可以通过 `errorSerializer` 自定义错误类型：

```ts
// 定义错误类型
interface AppError {
  code: number
  message: string
}

// 在工厂函数中配置
const useApi = createRequest({
  dataKey: 'data',
  errorSerializer: (e: any): AppError => ({
    code: e?.response?.status ?? -1,
    message: e?.message ?? String(e)
  })
})

const { error } = useApi(getUser)
// error 的类型是 Ref<AppError | undefined>，自动推导的
```

这样所有通过这个实例创建的请求，`error` 都会是统一的 `AppError` 类型。

### 分页管理

```ts
const usePage = createPagination({
  listKey: 'data.list',
  totalKey: 'data.total'
})

const { list, total, page, pageSize } = usePage(getUserPage)

// page 和 pageSize 是 Ref，改了就会自动重新请求
page.value = 2
```

### 多后端适配

如果你的项目对接多个后端，每个后端返回的数据结构都不一样：

```ts
// 后端 A: { code: 0, data: {...} }
const useApiA = createRequest({ dataKey: 'data' })

// 后端 B: { success: true, result: { data: {...} } }
const useApiB = createRequest({ dataKey: 'result.data' })

// 后端 C: { status: 200, response: { body: {...} } }
const useApiC = createRequest({ dataKey: 'response.body' })

// 组件里用起来都一样
const { data: userA } = useApiA(getUserFromA)
const { data: userB } = useApiB(getUserFromB)
const { data: userC } = useApiC(getUserFromC)
// 三个 data 都是 User 类型
```

## 其他功能

### 缓存

```ts
const { data } = useApi(getUserList, {
  cacheKey: 'user-list',
  staleTime: 5000,           // 5秒内直接用缓存
  cacheTime: 10 * 60 * 1000  // 缓存保留10分钟
})
```

### 错误重试

```ts
const { data } = useApi(getUser, {
  errorRetryCount: 3,
  errorRetryInterval: 1000
})
```

### 轮询

```ts
const { data } = useApi(getSystemStatus, {
  pollingInterval: 5000,
  pollingWhenDocumentHidden: false
})
```

### 依赖请求

当一个请求依赖另一个请求的结果时，可以使用 `ready` 和 `watchSource` 配合：

```ts
// 请求 A：获取用户列表
const { data: users } = useApi(getUsers)

// 请求 B：依赖请求 A 的结果
const ready = computed(() => !!users.value && users.value.length > 0)

const { data: orders } = useApi(
  () => getUserOrders(users.value[0].id),
  {
    ready,              // 控制请求是否可以发起
    watchSource: users  // 监听 users 变化自动刷新
  }
)
```

或者使用 `watchSource: true` 自动收集依赖：

```ts
const type = ref(0)

// 自动收集 service 中的响应式依赖
const { data } = useApi(
  () => getLibs(type.value),
  {
    watchSource: true
  }
)
```

### 自定义插件

```ts
import { definePlugin } from 'vue-rex'

const loggerPlugin = definePlugin((context) => ({
  onBefore() {
    console.log('请求开始', context.params)
  },
  onSuccess(data) {
    console.log('请求成功', data)
  },
  onError(error) {
    console.error('请求失败', error)
  }
}))

const useApi = createRequest({ 
  dataKey: 'data',
  plugins: [loggerPlugin]
})
```

## 相关链接

- [NPM](https://www.npmjs.org/package/vue-rex)
- [文档](https://songpeng154.github.io/vue-rex/)
- [GitHub](https://github.com/songpeng154/vue-rex)

---

如果 Vue Rex 对你有帮助，欢迎到 [GitHub](https://github.com/songpeng154/vue-rex) 给个 Star ⭐️，这对项目的持续维护很重要！

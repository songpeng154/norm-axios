---
outline: deep
---

# 介绍

`Vue Rex` 是一个专为 Vue 3 设计的高度灵活、类型安全且插件化的请求 Hook 库。

## 核心特性

- 🏭 **工厂函数模式**：`createRequest` / `createPagination` 创建可复用实例，一次配置全局共享
- 🛡️ **类型自动推导**：根据 service 返回类型和工厂配置自动推导 `data` 类型
- 🌐 **多后端适配**：`dataKey` / `listKey` + `totalKey` 统一不同后端响应结构
- ⚡ **防抖 / 节流**：内置 `debounceRun` / `throttleRun`，无需额外依赖
- 💾 **缓存 & SWR**：内存缓存 + Stale-While-Revalidate，列表切换秒开
- 🔄 **错误重试**：可配置重试次数和间隔，网络抖动自动恢复
- 🔁 **轮询**：自动定时重新请求，适合实时数据场景
- 📄 **分页管理**：`page` / `pageSize` 修改即自动请求，无需 watch
- 🔌 **插件化**：`definePlugin` 自定义扩展，请求生命周期全链路可介入
- ⚙️ **全局默认值**：工厂函数 options 即全局配置，零重复代码

## 解决的问题

假设后端统一返回 `{ code: number, data: T, msg: string }`，一个获取用户详情的请求通常写成这样：

```ts
// api/user.ts —— 类型定义 + 接口声明
interface Response<T> {
  code: number
  data: T
  msg: string
}

export interface User {
  id: number
  name: string
  email: string
}

export const getUser = () => server.get<Response<User>>('/api/user/1')
```

```vue
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getUser } from '@/api/user'
import type { User } from '@/api/user'

const loading = ref(false)
const data = ref<User | null>(null)

const fetchUser = async () => {
  loading.value = true
  const res = await getUser().finally(() => {
    loading.value = false
  })
  if (res.code !== 0) {
    console.error(res.msg)
  } else {
    data.value = res.data
  }
}
onMounted(() => fetchUser())
</script>
```

每个接口都要复制 loading 管理、code 判断、数据提取。**Vue Rex 的做法**：

```ts
// hooks/api.ts
import { createRequest } from 'vue-rex'

export const useApi = createRequest({ dataKey: 'data' })
```

```vue
<script setup lang="ts">
import { getUser } from '@/api/user'
import { useApi } from '@/hooks/api'

const { data, loading } = useApi(getUser)
</script>
```

> **异常机制**：vue-rex 的 `error` 来自 service 抛出 reject。你需要在 axios 拦截器中统一处理业务异常：
>
> ```ts
> // 响应拦截器
> server.interceptors.response.use(
>   (res) => {
>     if (res.data.code !== 0) return Promise.reject(res.data.msg)
>     return res.data
>   },
>   (err) => Promise.reject(err),
> )
> ```
>
> 这样 service 成功时直接返回业务数据，失败时抛出 reject → vue-rex 的 `error` 自动捕获。配置 `errorRetryCount` 后还会自动重试。

防抖、节流、缓存、错误重试、轮询等特性同样传 option 即开即用。

## 核心理念

推荐项目分层：API 层定义类型和接口 → Hooks 层封装 vue-rex → 组件直接使用。

```ts
// api/user.ts —— API 层
interface Response<T> { code: number; data: T; msg: string }

export interface User { id: number; name: string; email: string }

// 普通请求：后端返回 Response<User>
export const getUser = (id: number) => server.get<Response<User>>(`/api/user/${id}`)

// 分页请求：后端返回 Response<{ list: User[]; total: number }>
export const getUserPage = (params: { page: number; pageSize: number }) =>
  server.get<Response<{ list: User[]; total: number }>>('/api/users', { params })
```

```ts
// hooks/api.ts —— Hooks 层
import { createRequest, createPagination } from 'vue-rex'

// createRequest 用于普通请求
export const useApi = createRequest({
  dataKey: 'data',
  options: { errorRetryCount: 2 },
})

// createPagination 用于分页请求
export const usePage = createPagination({
  listKey: 'data.list',
  totalKey: 'data.total',
})
```

```vue
<!-- 普通请求：获取用户详情 -->
<script setup lang="ts">
import { useApi } from '@/hooks/api'
import { getUser } from '@/api/user'

const { data, loading } = useApi(() => getUser(1))
</script>
```

```vue
<!-- 分页请求：获取用户列表 -->
<script setup lang="ts">
import { usePage } from '@/hooks/api'
import { getUserPage } from '@/api/user'

const { list, total, page, pageSize } = usePage(getUserPage)
</script>
```

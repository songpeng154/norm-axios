---
outline: deep
---

# Introduction

`Vue Rex` is a highly flexible, type-safe, and plugin-based request Hook library designed for Vue 3.

## Core Features

- 🏭 **Factory pattern**: `createRequest` / `createPagination` — configure once, share globally
- 🛡️ **Type inference**: `data` type auto-inferred from service return type and factory config
- 🌐 **Backend adaptation**: `dataKey` / `listKey` + `totalKey` unify different response structures
- ⚡ **Debounce / throttle**: built-in `debounceRun` / `throttleRun`, no extra dependencies
- 💾 **Cache & SWR**: memory cache + Stale-While-Revalidate for instant list restores
- 🔄 **Error retry**: configurable retry count and interval for network resilience
- 🔁 **Polling**: auto re-fetch on interval, ideal for real-time data
- 📄 **Pagination**: `page` / `pageSize` changes trigger requests — no manual `watch`
- 🔌 **Plugins**: `definePlugin` for custom request lifecycle hooks
- ⚙️ **Global defaults**: factory options serve as project-wide config

## The Problem

When the backend returns `{ code: number, data: T, msg: string }`, a typical request to fetch user details looks like this:

```ts
// api/user.ts —— type definitions + API declarations
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

This boilerplate — loading management, code checks, data extraction — repeats for every endpoint. **Vue Rex's approach**:

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

> **Error mechanism**: vue-rex's `error` comes from the service rejecting. Set up an axios interceptor to handle business errors:
>
> ```ts
> // response interceptor
> server.interceptors.response.use(
>   (res) => {
>     if (res.data.code !== 0) return Promise.reject(res.data.msg)
>     return res.data
>   },
>   (err) => Promise.reject(err),
> )
> ```
>
> Now successful responses return data directly, and failures reject → vue-rex's `error` captures it automatically. Add `errorRetryCount` for automatic retries.

Debounce, throttle, cache, error retry, polling — all enabled by passing the corresponding option.

## Core Idea

Recommended layering: API layer defines types and endpoints → Hooks layer wraps vue-rex → components consume directly.

```ts
// api/user.ts — API layer
interface Response<T> { code: number; data: T; msg: string }

export interface User { id: number; name: string; email: string }

// Basic request: backend returns Response<User>
export const getUser = (id: number) => server.get<Response<User>>(`/api/user/${id}`)

// Paginated request: backend returns Response<{ list: User[]; total: number }>
export const getUserPage = (params: { page: number; pageSize: number }) =>
  server.get<Response<{ list: User[]; total: number }>>('/api/users', { params })
```

```ts
// hooks/api.ts — Hooks layer
import { createRequest, createPagination } from 'vue-rex'

// createRequest for basic requests
export const useApi = createRequest({
  dataKey: 'data',
  options: { errorRetryCount: 2 },
})

// createPagination for paginated requests
export const usePage = createPagination({
  listKey: 'data.list',
  totalKey: 'data.total',
})
```

```vue
<!-- Basic: fetch user detail -->
<script setup lang="ts">
import { useApi } from '@/hooks/api'
import { getUser } from '@/api/user'

const { data, loading } = useApi(() => getUser(1))
</script>
```

```vue
<!-- Paginated: fetch user list -->
<script setup lang="ts">
import { usePage } from '@/hooks/api'
import { getUserPage } from '@/api/user'

const { list, total, page, pageSize } = usePage(getUserPage)
</script>
```

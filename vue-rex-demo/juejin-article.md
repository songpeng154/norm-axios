# vue-rex：用 dataKey 告别重复的数据提取

## 前言

后端返回的数据结构，通常是这样的：

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "name": "张三",
    "age": 25
  }
}
```

前端真正需要的只是 `data`，但使用其他库时，不得不每次都手动提取：

```ts
// api/user.ts
export const getUser = () => axios.get('/api/user')

// TanStack Query - 每次都要写 select，且不支持全局配置
const { data } = useQuery({
  queryKey: ['user'],
  queryFn: getUser,
  select: (res) => res.data.data,
})

// Vue Request - 只能在 service 里手动提取
const { data } = useRequest(async () => {
  const res = await getUser()
  return res.data.data
})
```

**vue-rex** 用一个 `dataKey` 配置彻底解决这个问题。

## 核心亮点

### 1. 声明式数据提取 + 自动类型推导

只需配置一次 `dataKey`，自动从响应中提取数据，并且 **TypeScript 自动推导类型**：

```ts
const useApi = createRequest({ dataKey: 'data' })

const { data } = useApi(getUser)
// data 自动推导为 { name: string, age: number }，无需手动标注
```

支持嵌套路径：`dataKey: 'result.data.list'`

其他库需要手动标注类型：

```ts
// TanStack Query - 需要手动标注泛型
const { data } = useQuery<User>({
  queryKey: ['user'],
  queryFn: getUser,
  select: (res) => res.data.data,
})
```

### 2. 工厂函数模式

一次配置，全局复用：

```ts
// api.ts - 创建一次
export const useApi = createRequest({ dataKey: 'data' })

// 任何组件中直接使用
const { data: users } = useApi(fetchUsers)
const { data: posts } = useApi(fetchPosts)
```

### 3. 内置常用能力

开箱即用，无需额外封装：

- ✅ 分页管理（createPagination）
- ✅ 数据缓存 & SWR
- ✅ 轮询请求
- ✅ 防抖 / 节流
- ✅ 错误重试
- ✅ 乐观更新

## 与其他库对比

| 特性 | vue-rex | TanStack Query | Vue Request | Alova |
|------|---------|----------------|-------------|-------|
| 数据提取 | `dataKey: 'data'` | `select` 函数 | 无 | `transform` |
| 全局配置 | ✅ | ❌ | - | 部分 |
| 类型推导 | 自动 | 手动 | 手动 | 支持 |
| 分页支持 | 内置 | 需封装 | 需封装 | 需封装 |
| 工厂模式 | ✅ | ❌ | ❌ | 部分 |

## 快速开始

### 安装

```bash
pnpm add vue-rex
```

### 基础用法

```ts
import { createRequest } from 'vue-rex'

// 创建请求工厂
const useApi = createRequest({ dataKey: 'data' })

// 在组件中使用
const { data, loading, error } = useApi(getUser)
```

## 代码示例

### 示例 1：基础请求

```vue
<script setup>
import { createRequest } from 'vue-rex'

const useApi = createRequest({ dataKey: 'data' })

const { data, loading, error } = useApi(getUser)
</script>

<template>
  <div v-if="loading">加载中...</div>
  <div v-else-if="error">{{ error.message }}</div>
  <div v-else>{{ data.name }}</div>
</template>
```

### 示例 2：分页列表

```vue
<script setup>
import { createPagination } from 'vue-rex'

const usePage = createPagination({
  listKey: 'data.list',
  totalKey: 'data.total',
})

const { list, total, page, pageSize, run } = usePage(getUserList)
</script>

<template>
  <ul>
    <li v-for="user in list" :key="user.id">{{ user.name }}</li>
  </ul>
  <button @click="run({ page: page + 1, pageSize })">下一页</button>
</template>
```

### 示例 3：缓存共享

```ts
import { createRequest } from 'vue-rex'

const useApi = createRequest({ dataKey: 'data' })

// 组件 A
const { data } = useApi(fetchUsers, {
  cacheKey: 'user-list',
  staleTime: 5000, // 5秒内数据保持新鲜
})

// 组件 B - 使用相同 cacheKey，共享数据
const { data } = useApi(fetchUsers, {
  cacheKey: 'user-list',
})
```

## 总结

vue-rex 的核心价值：

1. **更简洁** - `dataKey: 'data'` 替代重复的数据提取代码
2. **更智能** - 自动类型推导，无需手动标注泛型
3. **更高效** - 工厂模式一次配置，全局复用
4. **更完整** - 分页、缓存、轮询等常用能力开箱即用

如果你也厌倦了每次都写 `res.data.data`，不妨试试 vue-rex。

## 相关链接

- 📦 [GitHub 仓库](https://github.com/songpeng154/vue-rex)
- 📖 [官方文档](https://vue-rex.vercel.app)
- 📝 [npm 包](https://www.npmjs.com/package/vue-rex)

欢迎 Star ⭐ 和提交 Issue！

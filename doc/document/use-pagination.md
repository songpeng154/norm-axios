---
outline: deep
---

# 分页请求

`usePagination` 是专门为分页场景设计的 Hook，支持传统分页和追加模式（无限滚动）。

## 基础用法

它接收一个 service 函数，该函数通常接收分页参数。

```typescript
import { usePagination } from 'vue-rex'

const { data, loading, run } = usePagination(
  (params) => getList(params), 
  {
    defaultParams: [{ page: 1, pageSize: 10 }]
  }
)
```

## 追加模式 (无限滚动)

通过设置 `appendMode: true`，新请求的数据会自动追加到 `data` 列表末尾，而不是替换。

```typescript
const { data, loading, loadMore, hasMore } = usePagination(service, {
  appendMode: true,
  // 必须：告知如何从响应中判断是否还有更多数据
  paginationSerializer: (res) => {
    return {
      list: res.list,
      total: res.total,
      hasMore: res.page < res.totalPages
    }
  }
})
```

### 属性说明

*   `data`: 当前已加载的所有数据列表（追加模式下会累积）。
*   `hasMore`: 是否还有更多数据。
*   `loadMore`: 触发加载下一页的函数。
*   `loading`: 是否正在加载中（包括加载更多过程）。

## 滚动触底加载

配合 `scrollTarget` 属性，可以自动监听指定容器的滚动事件，并在触底时自动调用 `loadMore`。

```vue
<template>
  <div id="scroll-container" style="height: 400px; overflow-y: auto;">
    <div v-for="item in data" :key="item.id">{{ item.name }}</div>
    <div v-if="loading">加载中...</div>
    <div v-if="!hasMore">没有更多了</div>
  </div>
</template>

<script setup>
const { data, loading, hasMore } = usePagination(service, {
  appendMode: true,
  scrollTarget: '#scroll-container', // 也可以传 Ref
  offset: 100, // 距离底部 100px 时触发
  paginationSerializer: (res) => ({
    list: res.list,
    hasMore: res.hasNext
  })
})
</script>
```

## 自定义分页参数

你可以通过 `paginationSerializer` 统一处理后端返回的分页结构。

| 参数 | 类型 | 描述 |
| :--- | :--- | :--- |
| `list` | `any[]` | 当前页的数据列表 |
| `total` | `number` | 总条数（可选） |
| `hasMore` | `boolean` | 是否还有下一页 |

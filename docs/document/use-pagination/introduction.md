---
outline: deep
---

# createPagination 介绍

`createPagination` 用于创建分页请求实例，基于 `createRequest`，支持其全部功能。

## 基本用法

```typescript
import { createPagination } from 'vue-rex'

// 假设后端返回 { code: 0, data: { list: User[], total: number } }
const usePage = createPagination({
  listKey: 'data.list',
  totalKey: 'data.total',
})

interface User { id: number; name: string }

const getUsers = (params: { page: number; pageSize: number }) =>
  server.get<{ data: { list: User[]; total: number } }>('/api/users', { params })

const { list, total, page, pageSize, totalPage, isLastPage, reset } = usePage(getUsers)
```

修改 `page` 或 `pageSize` 自动触发请求；调用 `reset()` 回到第一页。

::: demo
use-pagination/base
:::

## 配置

| 配置项 | 类型 | 说明 |
|:---|:---|:---|
| `listKey` | `string` | 列表字段路径，支持点号 `data.records` |
| `totalKey` | `string` | 总条数字段路径，支持点号 |
| `paginationSerializer` | `(page, pageSize) => object` | 将 page/pageSize 映射为后端参数名，如 `{ current: page, size: pageSize }` |
| `options` | `object` | 全局默认配置，被调用时局部 options 覆盖 |

## Options

`usePage(service, options)` 支持 [createRequest 全部 Options](../use-request/introduction.md#options)，外加：

| 选项 | 类型 | 默认值 | 说明 |
|:---|:---|:---|:---|
| `initialPage` | `number` | `1` | 初始页码 |
| `initialPageSize` | `number` | `10` | 初始每页条数 |
| `pageWatch` | `boolean` | `true` | page 变化时是否自动请求 |
| `resetPageWhenPageSizeChange` | `boolean` | `true` | pageSize 变化时是否重置到第一页 |
| `formatList` | `(list, rawData, params) => TFormatData[]` | - | 对列表项做二次处理 |

## 返回值

在 [createRequest 返回值](../use-request/introduction.md#返回值) 基础上，额外提供：

| 属性 | 类型 | 说明 |
|:---|:---|:---|
| `list` | `ComputedRef<TFormatData[]>` | 当前页数据列表 |
| `total` | `ComputedRef<number>` | 数据总条数 |
| `page` | `Ref<number>` | 当前页码（可写） |
| `pageSize` | `Ref<number>` | 每页条数（可写） |
| `totalPage` | `ComputedRef<number>` | 总页数 |
| `isLastPage` | `ComputedRef<boolean>` | 是否最后一页 |
| `reset` | `() => void` | 重置到第一页 |

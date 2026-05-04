---
outline: deep
---

# createPagination

`createPagination` creates paginated request instances, built on top of `createRequest` with full feature support.

## Basic Usage

```typescript
import { createPagination } from 'vue-rex'

// Backend returns { code: 0, data: { list: User[], total: number } }
const usePage = createPagination({
  listKey: 'data.list',
  totalKey: 'data.total',
})

interface User { id: number; name: string }

const getUsers = (params: { page: number; pageSize: number }) =>
  server.get<{ data: { list: User[]; total: number } }>('/api/users', { params })

const { list, total, page, pageSize, totalPage, isLastPage, reset } = usePage(getUsers)
```

Change `page` or `pageSize` to auto-trigger a request; call `reset()` to return to page 1.

::: demo
use-pagination/base
:::

## Configuration

| Config | Type | Description |
|:---|:---|:---|
| `listKey` | `string` | List field path, supports dot notation `data.records` |
| `totalKey` | `string` | Total count field path, supports dot notation |
| `paginationSerializer` | `(page, pageSize) => object` | Map page/pageSize to backend param names, e.g. `{ current: page, size: pageSize }` |
| `options` | `object` | Global defaults, overridden by local options |

## Options

`usePage(service, options)` supports [all createRequest Options](../use-request/introduction.md#options), plus:

| Option | Type | Default | Description |
|:---|:---|:---|:---|
| `initialPage` | `number` | `1` | Initial page number |
| `initialPageSize` | `number` | `10` | Initial page size |
| `pageWatch` | `boolean` | `true` | Auto-request on page change |
| `resetPageWhenPageSizeChange` | `boolean` | `true` | Reset to page 1 when pageSize changes |
| `formatList` | `(list, rawData, params) => TFormatData[]` | - | Transform list items |

## Return Value

Extends [createRequest return value](../use-request/introduction.md#return-value) with:

| Property | Type | Description |
|:---|:---|:---|
| `list` | `ComputedRef<TFormatData[]>` | Current page data |
| `total` | `ComputedRef<number>` | Total record count |
| `page` | `Ref<number>` | Current page (writable) |
| `pageSize` | `Ref<number>` | Page size (writable) |
| `totalPage` | `ComputedRef<number>` | Total pages |
| `isLastPage` | `ComputedRef<boolean>` | Whether last page |
| `reset` | `() => void` | Reset to first page |

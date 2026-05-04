---
outline: deep
---

[createPagination](./home) / **PaginationData**

# 接口：PaginationData

[createPagination](./home.md) 的分页数据结构

## 类型声明

```typescript
export interface PaginationData<TItem = any> {
  list: TItem[]
  total: number
}
```

## 泛型

| 名称     | 默认值   | 继承 | 可选  | 描述     |
|:-------|:------|:---|:----|--------|
| `TItem` | `any` |    | `是` | 列表项类型 |

## 属性

### list

* `必填` - `TItem[]`

列表数据

### total

* `必填` - `number`

列表总数

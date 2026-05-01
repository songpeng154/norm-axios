---
outline: deep
---

[usePagination](./home) / **PaginationResponse**

# 接口：PaginationResponse

[usePagination](./home.md)的分页规范

## 类型声明

```typescript
export interface PaginationResponse<TResponse = any> {
  list: TResponse[]

  total: number
}
```

## 泛型

| 名称          | 默认值   | 继承 | 可选  | 描述     |
|:------------|:------|:---|:----|--------|
| `TResponse` | `any` |    | `是` | 数据类型   |


## 属性

### list

* ` 必填` - `TResponse[]`

列表数据

### total

* `必填` - `number`

列表总数



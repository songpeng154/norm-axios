---
outline: deep
---

[usePagination](./home) / **PaginationServiceFn**

# 类型：PaginationServiceFn

[usePagination](./home.md)的服务函数类型

## 类型声明

```typescript
export type PaginationServiceFn<
  // 数据
  TData extends PaginationResponse = PaginationResponse,
  // 原始数据
  TRawData = any,
> = (pagination: { page: number, pageSize: number }) => Promise<ResponseContent<TData, TRawData>>
```

## 泛型

| 名称         | 默认值                                         | 继承                                          | 可选  | 描述     |
|:-----------|:--------------------------------------------|:--------------------------------------------|:----|--------|
| `TData`    | [PaginationResponse](./pagination-response) | [PaginationResponse](./pagination-response) | `是` | 数据类型   |
| `TRawData` | `any`                                       |                                             | `是` | 原始数据类型 |

## 入参

| 名称           | 类型                                   | 默认值 | 描述                           |
|:-------------|:-------------------------------------|:----|:-----------------------------|
| `pagination` | `{ page: number, pageSize: number }` |     | page:当前分页;<br>pageSize:分页数量; |

## 返回值

[Promise<ResponseContent<TData, TRawData>>](/api-reference/common-type/response-content)



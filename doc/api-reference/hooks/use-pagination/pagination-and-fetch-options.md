---
outline: deep
---

[usePagination](./home) / **PaginationAndFetchOptions**

# 类型：PaginationAndFetchOptions

## 类型声明

```typescript
export type PaginationAndFetchOptions<
  // 数据
  TData extends PaginationResponse = PaginationResponse,
  // 方法参数
  TParams extends any[] = any[],
  // 格式化数据
  TFormatData extends PaginationResponse = TData,
  // 原始数据
  TRawData = any,
> =
  PaginationOptions &
  RequestOptions<TData, TParams, TFormatData, TRawData>
```

## 泛型

| 名称            | 默认值                                         | 继承                                          | 可选  | 描述        |
|:--------------|:--------------------------------------------|:--------------------------------------------|:----|-----------|
| `TData`       | [PaginationResponse](./pagination-response) | [PaginationResponse](./pagination-response) | `是` | 数据类型      |
| `TParams`     | `any[]`                                     | `any[]`                                     | `是` | 函数入参类型    |
| `TFormatData` | `TData`                                     | [PaginationResponse](./pagination-response) | `是` | 格式化数据后的类型 |
| `TRawData`    | `any`                                       |                                             | `是` | 原始数据类型    |

## 引用

* [PaginationOptions](./pagination-options)
* [RequestOptions](../use-request/request-options)




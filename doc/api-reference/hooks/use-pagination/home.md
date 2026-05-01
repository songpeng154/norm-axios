---
outline: deep
---

# usePagination

`usePagination` 是基于 [useRequest](../use-request/home.md) 的分页请求 hook，用于处理分页数据请求



::: warning 注意
[service](./pagination-service-fn) 返回数据必须符合 [PaginationResponse](./pagination-response) 分页规范（字段名称必须有:`list`、`total`）。若服务数据格式不兼容，开发者需要封装格式转换函数，或在响应拦截器中强制规范数据格式。
:::

## 特性

* 支持[useRequest](../use-request/home.md)的全部功能
* 自动管理分页状态
* 无限滚动
* `pageSize`变化后重置分页

## 类型声明

```typescript
function usePagination<
  TData extends PaginationResponse = PaginationResponse,
  TParams extends any[] = any[],
  TFormatData extends PaginationResponse = TData,
  TRawData = any>
(
  service: PaginationServiceFn<TData, TRawData>,
  options?: PaginationAndFetchOptions<TData, TParams, TFormatData, TRawData>,
): PaginationResult<TData, TParams, TFormatData, TRawData>;
```

## 相关类型

### [PaginationResponse](./pagination-response)

### [PaginationServiceFn](./pagination-service-fn)

### [PaginationAndFetchOptions](./pagination-and-fetch-options)

### [PaginationOptions](./pagination-options)

### [PaginationResult](./pagination-result)

## 泛型

| 名称            | 默认值                                         | 继承                                          | 可选  | 描述        |
|:--------------|:--------------------------------------------|:--------------------------------------------|:----|-----------|
| `TData`       | [PaginationResponse](./pagination-response) | [PaginationResponse](./pagination-response) | `是` | 数据类型      |
| `TParams`     | `any[]`                                     | `any[]`                                     | `是` | 函数入参类型    |
| `TFormatData` | `TData`                                     | [PaginationResponse](./pagination-response) | `是` | 格式化数据后的类型 |
| `TRawData`    | `any`                                       |                                             | `是` | 原始数据类型    |

## 入参

| 名称        | 类型                                                                                   | 默认值 | 可选  | 描述                         |
|:----------|:-------------------------------------------------------------------------------------|:----|-----|:---------------------------|
| `service` | [PaginationServiceFn\<TData, TRawData>](./pagination-service-fn)                     | -   | `否` | 异步函数 |
| `options` | [PaginationAndFetchOptions\<TData, TParams, TFormatData, TRawData>](./pagination-and-fetch-options) | -   | `是` | 配置对象                       |

#### 返回值

[PaginationResult<TData, TParams, TFormatData, TRawData>](./pagination-result.md)

---
outline: deep
---

[usePagination](./home) / **PaginationResult**

# 接口：PaginationResult

[usePagination](./home)的返回值类型

## 类型声明

```typescript
import { ComputedRef, Ref } from 'vue'

export interface PaginationResult<
  // 数据
  TData extends PaginationResponse = PaginationResponse,
  // 方法参数
  TParams extends any[] = any[],
  // 格式化数据
  TFormatData extends PaginationResponse = TData,
  // 原始数据
  TRawData = any,
> extends RequestResult<TData, TParams, TFormatData, TRawData> {
  /**
   * 列表数据
   */
  list: ComputedRef<TFormatData['list']>

  /**
   * 当前分页
   * @default 1
   */
  page: Ref<number>

  /**
   * 分页数量
   * @default 10
   */
  pageSize: Ref<number>

  /**
   * 数据总数
   */
  total: ComputedRef<number>

  /**
   * 分页总数
   */
  totalPage: ComputedRef<number>

  /**
   * 是否是最后一页
   */
  isLastPage: ComputedRef<boolean>
}

```

## 泛型

| 名称            | 默认值                                         | 继承                                          | 可选  | 描述        |
|:--------------|:--------------------------------------------|:--------------------------------------------|:----|-----------|
| `TData`       | [PaginationResponse](./pagination-response) | [PaginationResponse](./pagination-response) | `是` | 数据类型      |
| `TParams`     | `any[]`                                     | `any[]`                                     | `是` | 函数入参类型    |
| `TFormatData` | `TData`                                     | [PaginationResponse](./pagination-response) | `是` | 格式化数据后的类型 |
| `TRawData`    | `any`                                       |                                             | `是` | 原始数据类型    |

## 继承

[RequestResult<TData, TParams, TFormatData, TRawData>](../use-request/request-result)

## 属性

### list

* `可选` - `ComputedRef<TFormatData['list']>`

列表数据

### page

* `可选` - `Ref<number>`
* 默认值：`1`

当前分页

### pageSize

* `可选` - `number`
* 默认值：`10`

分页数量

### total

* `可选` - `ComputedRef<number>`

数据总数

### totalPage

* `可选` - `ComputedRef<number>`

分页总数

### isLastPage

* `可选` - `boolean`

是否是最后一页

---
outline: deep
---

[createPagination](./home) / **PaginationResult**

# 接口：PaginationResult

[createPagination](./home)返回的工厂函数的返回值类型

## 类型声明

```typescript
import { ComputedRef, Ref } from 'vue'
import type { DebouncedFunction } from 'es-toolkit'

export interface PaginationResult<
  TData = any,
  TParams extends Record<string, any> = Record<string, any>,
  TItem = any,
  TFormatData = TItem,
> extends Omit<
    RequestResult<
      TData,
      [TParams],
      PaginationData<TItem>,
      PaginationData<TFormatData>
    >,
    'params' | 'run' | 'debounceRun' | 'throttleRun' | 'optimisticUpdate'
  > {
  /** 当前请求参数 */
  params: ComputedRef<TParams>

  /** 手动触发 service 执行 */
  run: (params: TParams) => Promise&lt; Undefinable&lt; PaginationData&lt; TFormatData &gt; &gt; &gt;

  /** 与 run 用法一致，带防抖 */
  debounceRun: DebouncedFunction<(params: TParams) => Promise&lt; Undefinable&lt; PaginationData&lt; TFormatData &gt; &gt; &gt;>

  /** 与 run 用法一致，带节流 */
  throttleRun: DebouncedFunction<(params: TParams) => Promise&lt; Undefinable&lt; PaginationData&lt; TFormatData &gt; &gt; &gt;>

  /** 乐观更新 */
  optimisticUpdate: (
    newData: PaginationData<TFormatData> | ((oldData: PaginationData<TFormatData>) => PaginationData<TFormatData>),
    params?: TParams,
  ) => void

  /** 当前列表数据 */
  list: ComputedRef<TFormatData[]>

  /** 当前页码（可写） */
  page: Ref<number>

  /** 每页条数（可写） */
  pageSize: Ref<number>

  /** 数据总条数 */
  total: ComputedRef<number>

  /** 总页数 */
  totalPage: ComputedRef<number>

  /** 是否已是最后一页 */
  isLastPage: ComputedRef<boolean>

  /** 重置到第一页 */
  reset: () => void
}
```

## 泛型

| 名称            | 默认值       | 继承      | 可选  | 描述              |
|:--------------|:----------|:--------|:----|-----------------|
| `TData`       | `any`     |         | `是` | service 返回的数据类型 |
| `TParams`     | `Record<string, any>` | `Record<string, any>` | `是` | 分页请求参数类型 |
| `TItem`       | `any`     |         | `是` | 列表项类型          |
| `TFormatData` | `TItem`   |         | `是` | 格式化后的列表项类型    |

## 继承

[RequestResult&lt;TData, [TParams], PaginationData&lt;TItem&gt;, PaginationData&lt;TFormatData&gt;&gt;](../use-request/request-result)

## 属性

### list

* `必填` - `ComputedRef<TFormatData[]>`

列表数据

### page

* `必填` - `Ref<number>`
* 默认值：`1`

当前页码（可写）

### pageSize

* `必填` - `Ref<number>`
* 默认值：`10`

每页条数（可写）

### total

* `必填` - `ComputedRef<number>`

数据总条数

### totalPage

* `必填` - `ComputedRef<number>`

总页数

### isLastPage

* `必填` - `ComputedRef<boolean>`

是否已是最后一页

## 方法

### run

手动触发 service 执行

#### 入参

| 名称       | 类型        | 默认值 | 描述   |
|:---------|:----------|:----|:-----|
| `params` | `TParams` |     | 请求参数 |

#### 返回值

`Promise&lt; Undefinable&lt; PaginationData&lt; TFormatData &gt; &gt; &gt;`

### debounceRun

与 [run](#run) 用法一致，带防抖

#### 入参

| 名称       | 类型        | 默认值 | 描述   |
|:---------|:----------|:----|:-----|
| `params` | `TParams` |     | 请求参数 |

#### 返回值

`Promise&lt; Undefinable&lt; PaginationData&lt; TFormatData &gt; &gt; &gt;`

### throttleRun

与 [run](#run) 用法一致，带节流

#### 入参

| 名称       | 类型        | 默认值 | 描述   |
|:---------|:----------|:----|:-----|
| `params` | `TParams` |     | 请求参数 |

#### 返回值

`Promise&lt; Undefinable&lt; PaginationData&lt; TFormatData &gt; &gt; &gt;`

### optimisticUpdate

乐观更新

#### 入参

| 名称        | 类型                                                                                     | 默认值 | 描述 |
|:----------|:---------------------------------------------------------------------------------------|:----|:---|
| `newData` | `PaginationData&lt;TFormatData&gt; \| ((oldData: PaginationData&lt;TFormatData&gt;) =&gt; PaginationData&lt;TFormatData&gt;)` |     | 新数据 |
| `params`  | `TParams`                                                                              | 可选 | 入参 |

#### 返回值

`void`

### reset

重置到第一页

#### 返回值

`void`

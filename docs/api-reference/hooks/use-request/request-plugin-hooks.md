---
outline: deep
---

[useRequest](./home) / **RequestPluginHooks**

# 接口：RequestPluginHooks

插件钩子类型

## 类型声明

```typescript
import { any } from '请求'

export interface RequestPluginHooks<
  // 数据
  TData = any,
  // 方法参数
  TParams extends any[] = any[],
  // 格式化数据
  TFormatData = TData,
  // 原始数据
  TRawData = any,
> {
  /**
   * 请求之前触发
   */
  onBefore?: (params: TParams) => {
    // 是否直接 return,停止后续执行
    isReturned?: boolean
  } | void

  /**
   * 请求开始时触发
   */
  onRequest?: (service: (...params: TParams) => Promise<ResponseContent<TData, TRawData>>, params: TParams) => {
    servicePromise: Promise<ResponseContent<TData, TRawData>>
  }

  /**
   * 请求失败时触发
   */
  onError?: (
    error: ResponseError,
    params: TParams,
    response: any<TRawData>,
  ) => void

  /**
   * 请求成功时触发
   */
  onSuccess?: (
    data: TFormatData,
    params: TParams,
    response: any<TRawData>,
  ) => void

  /**
   * 当连续请求的时候，最后一个服务请求完成之后触发
   */
  onFinallyFetchDone?: () => void

  /**
   * 最后执行，不管 server 成功还是失败都会执行
   */
  onFinally?: (params: TParams) => void

  /**
   * 通过 mutate 修改数据时触发
   */
  onMutate?: (newData: TFormatData) => void

  /**
   * 通过 cancel 取消请求时触发
   */
  onCancel?: () => void
}

```

## 泛型

| 名称            | 默认值     | 继承      | 必填  | 描述        |
|:--------------|:--------|:--------|:----|-----------|
| `TData`       | `any`   |         | `是` | 数据类型      |
| `TParams`     | `any[]` | `any[]` | `是` | 函数入参类型    |
| `TFormatData` | `TData` |         | `是` | 格式化数据后的类型 |
| `TRawData`    | `any`   |         | `是` | 原始数据类型    |

### onBefore

请求之前钩子

#### 入参

| 名称       | 类型        | 默认值 | 描述   |
|:---------|:----------|:----|:-----|
| `params` | `TParams` |     | 请求参数 |

#### 返回值

`{ isReturned?: boolean } | void`

| 名称           | 类型        | 必填  | 描述                   |
|:-------------|:----------|:----|----------------------|
| `isReturned` | `boolean` | `否` | 是否直接 `return`,停止后续执行 |

### onRequest

请求开始时触发

#### 入参

| 名称        | 类型                                                                  | 默认值 | 描述   |
|:----------|:--------------------------------------------------------------------|:----|:-----|
| `service` | `(...params: TParams) => Promise<ResponseContent<TData, TRawData>>` |     | 请求服务 |
| `params`  | `TParams`                                                           |     | 请求参数 |

#### 返回值

| 名称               | 类型                                          | 必填  | 描述          |
|:-----------------|:--------------------------------------------|:----|-------------|
| `servicePromise` | `Promise<ResponseContent<TData, TRawData>>` | `是` | 服务`Promise` |

### onError

请求失败时触发

#### 入参

| 名称         | 类型                                                         | 默认值 | 描述          |
|:-----------|:-----------------------------------------------------------|:----|:------------|
| `error`    | [ResponseError](/api-reference/common-type/response-error) |     | 错误信息        |
| `params`   | `TParams`                                                  |     | 请求参数        |
| `response` | [any\<TRawData>](https://github.com/请求/请求) |     | `请求`原始响应 |

#### 返回值

`void`

### onSuccess

请求成功时触发

#### 入参

| 名称         | 类型                                                         | 默认值 | 描述            |
|:-----------|:-----------------------------------------------------------|:----|:--------------|
| `data`     | `TFormatData`                                              |     | 数据 \| 格式化后的数据 |
| `params`   | `TParams`                                                  |     | 请求参数          |
| `response` | [any\<TRawData>](https://github.com/请求/请求) |     | `请求`原始响应   |

#### 返回值

`void`

### onFinallyFetchDone

当连续请求的时候，最后一个服务请求完成之后触发

#### 返回值

`void`

### onFinally

最后执行，不管 server 成功还是失败都会执行

#### 入参

| 名称       | 类型        | 默认值 | 描述   |
|:---------|:----------|:----|:-----|
| `params` | `TParams` |     | 请求参数 |

#### 返回值

`void`

### onMutate

通过 [mutate](./request-method#mutate) 修改数据时触发

#### 入参

| 名称     | 类型            | 默认值 | 描述            |
|:-------|:--------------|:----|:--------------|
| `data` | `TFormatData` |     | 数据 \| 格式化后的数据 |

#### 返回值

`void`

### onCancel

通过 [cancel](./request-method#cancel) 取消请求时触发

#### 返回值

`void`
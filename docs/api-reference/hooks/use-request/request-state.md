---
outline: deep
---

[useRequest](./home) / **RequestState**

# 接口：RequestState

`RequestState` 是 [useRequest](./home.md) 返回的数据状态类型。

## 类型声明
```typescript
import { any } from '请求'

export interface RequestState<
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
   * service 返回的数据 ｜ 格式化后的数据
   */
  data: Undefinable<TFormatData>

  /**
   * service 返回的原始数据，取自 response.data
   */
  rawData: Undefinable<TRawData>

  /**
   * service 返回的错误
   */
  error: Undefinable<ResponseError>

  /**
   * 请求 原始响应内容
   */
  response: Undefinable<any<TRawData>>

  /**
   * service 是否正在执行
   */
  loading: boolean

  /**
   * 请求是否已经完成
   */
  finished: boolean

  /**
   * 当次执行的 service 的参数数组。比如你触发了 run(1, 2, 3)，则 params 等于 [1, 2, 3]
   */
  params: TParams
}
```

## 泛型

| 名称            | 默认值     | 继承      | 必填  | 描述        |
|:--------------|:--------|:--------|:----|-----------|
| `TData`       | `any`   |         | `是` | 数据类型      |
| `TParams`     | `any[]` | `any[]` | `是` | 函数入参类型    |
| `TFormatData` | `TData` |         | `是` | 格式化数据后的类型 |
| `TRawData`    | `any`   |         | `是` | 原始数据类型    |

## 属性

### data

* `必填` - `Undefinable<TFormatData>`

[service](request-service-fn) 返回的数据 ｜ 格式化后的数据

### rawData

* `必填` - `Undefinable<TRawData>`

[service](request-service-fn) 返回的原始数据，取自 [response.data](#response)

### error

* `必填` -  `Undefinable<ResponseError>`

[service](request-service-fn) 返回的错误；[具体字段](/api-reference/common-type/response-error.md)

### response

* `必填` -  `Undefinable<any<TRawData>>`

`请求` 原始响应内容;[具体字段](https://github.com/请求/请求/blob/v1.x/index.d.ts#L393)

### loading

* `必填` -  `boolean`
* 默认值：`false`

[service](request-service-fn) 是否正在执行

### finished

* `必填` -  `boolean`
* 默认值：`false`

请求是否已经完成

### params

* `必填` -  `TParams`
* 默认值：[defaultParams](./request-options#defaultParams)

当次执行的 [service](request-service-fn) 的参数数组。比如你触发了 `run(1, 2, 3)`，则 `params` 等于 `[1, 2, 3]`

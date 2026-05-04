---
outline: deep
---

[createRequest](./home) / **RequestState**

# 接口：RequestState

`RequestState` 是 [createRequest](./home.md) 返回的数据状态类型。

## 类型声明
```typescript
export interface RequestState<
  // 数据
  TData = any,
  // 方法参数
  TParams extends any[] = any[],
  TSerialized = TData,
  // 格式化数据
  TFormatData = TSerialized,
> {
  /**
   * service resolve 的数据,会经过 formatData 处理
   */
  data: Undefinable<TFormatData>

  /**
   * service resolve 的数据
   */
  rawData: Undefinable<TData>

  /**
   * service reject/throw 的错误
   */
  error: Undefinable<any>

  /**
   * service 是否正在执行
   */
  loading: boolean

  /**
   * 请求是否已经完成
   */
  finished: boolean

  /**
   * 当次执行的 service 的参数数组
   */
  params: TParams
}
```

## 泛型

| 名称            | 默认值     | 继承      | 必填  | 描述        |
|:--------------|:--------|:--------|:----|-----------|
| `TData`       | `any`   |         | `是` | 数据类型      |
| `TParams`     | `any[]` | `any[]` | `是` | 函数入参类型    |
| `TSerialized` | `TData` |         | `是` | 序列化后的数据类型 |
| `TFormatData` | `TSerialized` |    | `是` | 格式化数据后的类型 |

## 属性

### data

* `必填` - `Undefinable<TFormatData>`

[service](request-service-fn) resolve 的数据，会经过 `formatData` 处理

### rawData

* `必填` - `Undefinable<TData>`

[service](request-service-fn) resolve 的原始数据

### error

* `必填` -  `Undefinable<any>`

[service](request-service-fn) reject/throw 的错误

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

当次执行的 [service](request-service-fn) 的参数数组。比如你触发了 `run(1, 2, 3)`，则 `params` 等于 `[1, 2, 3]`

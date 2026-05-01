---
outline: deep
---

[useRequest](./home) / **CachedData**

# 接口：CachedData

插件实现类型

## 类型声明

```typescript
export interface CachedData<
  // 数据
  TData = any,
  // 方法参数
  TParams extends any[] = any[],
  // 格式化数据
  TFormatData = TData,
  // 原始数据
  TRawData = any,
> {
  // 数据
  data: TFormatData

  // 原始数据
  rawData: TRawData

  // 响应体
  response?: any<TRawData>

  // 入参
  params: TParams

  // 请求的开始时间
  time: number

  // 定时器
  timer?: NodeJS.Timeout
}
```

## 泛型

| 名称            | 默认值     | 继承      | 可选  | 描述        |
|:--------------|:--------|:--------|:----|-----------|
| `TData`       | `any`   |         | `是` | 数据类型      |
| `TParams`     | `any[]` | `any[]` | `是` | 函数入参类型    |
| `TFormatData` | `TData` |         | `是` | 格式化数据后的类型 |
| `TRawData`    | `any`   |         | `是` | 原始数据类型    |

## 属性

### data

* `必填` - `TFormatData`

[data](./request-state#data) 初始的数据


### rawData

* `必填` - `TRawData`

[service](./request-service-fn) 返回的原始数据，取自 [response.data](./request-state.md#response)

### response

* `必填` -  `any<TRawData>`

`请求` 原始响应内容;[具体字段](https://github.com/请求/请求/blob/v1.x/index.d.ts#L393)

### params

* `必填` -  `TParams`
* 默认值：[defaultParams](./request-options#defaultParams)

当次执行的 [service](./request-service-fn) 的参数数组。比如你触发了 `run(1, 2, 3)`，则 `params` 等于 `[1, 2, 3]`


### time

* `必填` -  `number`

请求的开始时间


### timer

* `可选` -  `NodeJS.Timeout`

定时器

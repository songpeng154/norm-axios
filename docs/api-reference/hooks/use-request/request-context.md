---
outline: deep
---

[createRequest](./home) / **RequestContext**

# 接口：RequestContext

`RequestContext` 是 [RequestPluginImplement](./request-plugin-implement) 入参类型。

提供上下文状态

## 类型声明

```typescript
import { EffectScope } from 'vue'

export interface RequestContext<
  // 数据
  TData = any,
  // 方法参数
  TParams extends any[] = any[],
  TSerialized = TData,
  // 格式化数据
  TFormatData = TSerialized,
> extends RequestResult<TData, TParams, TSerialized, TFormatData> {
  // 当前作用域
  scope: EffectScope

  // 配置项
  options: RequestOptions<TData, TParams, TSerialized, TFormatData>

  // 原始 state
  rawState: RequestState<TData, TParams, TSerialized, TFormatData>

  // 设置状态
  setState: (
    state: Partial<RequestState<TData, TParams, TSerialized, TFormatData>>,
  ) => void
}
```

## 泛型

| 名称            | 默认值     | 继承      | 可选  | 描述        |
|:--------------|:--------|:--------|:----|-----------|
| `TData`       | `any`   |         | `是` | 数据类型      |
| `TParams`     | `any[]` | `any[]` | `是` | 函数入参类型    |
| `TSerialized` | `TData` |         | `是` | 序列化后的数据类型 |
| `TFormatData` | `TSerialized` |    | `是` | 格式化数据后的类型 |

## 继承

[RequestResult](./request-result)

## 属性

### scope

* `必填` - `EffectScope`

当前作用域

### options

* `可选` - [RequestOptions<TData, TParams, TSerialized, TFormatData>](./request-options)

配置项

### rawState

* `可选` -  [RequestState<TData, TParams, TSerialized, TFormatData>](./request-state)

原始 state

## 方法

### setState

设置状态

#### 入参

| 名称      | 类型                                                                              | 默认值 | 描述  |
|:--------|:--------------------------------------------------------------------------------|:----|:----|
| `state` | [Partial\<RequestState<TData, TParams, TSerialized, TFormatData>>](./request-state) | -   | 新状态 |

#### 返回值

`void`

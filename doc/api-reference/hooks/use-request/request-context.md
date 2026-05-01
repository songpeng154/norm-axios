---
outline: deep
---

[useRequest](./home) / **RequestContext**

# 接口：RequestContext

`RequestContext` 是 [RequestPluginImplement](./request-plugin-implement) 入参类型。

提供上下文状态

## 类型声明

```typescript
export interface RequestContext<
  // 数据
  TData = any,
  // 方法参数
  TParams extends any[] = any[],
  // 格式化数据
  TFormatData = TData,
  // 原始数据
  TRawData = any,
> extends RequestResult<TData, TParams, TFormatData, TRawData> {
  // 当前作用域
  scope: EffectScope

  // 配置项
  options: RequestOptions<TData, TParams, TFormatData, TRawData>

  // 原始 state
  rawState: RequestState<TData, TParams, TFormatData, TRawData>

  // 设置状态
  setState: (
    state: Partial<RequestState<TData, TParams, TFormatData, TRawData>>,
  ) => void
}
```

## 泛型

| 名称            | 默认值     | 继承      | 可选  | 描述        |
|:--------------|:--------|:--------|:----|-----------|
| `TData`       | `any`   |         | `是` | 数据类型      |
| `TParams`     | `any[]` | `any[]` | `是` | 函数入参类型    |
| `TFormatData` | `TData` |         | `是` | 格式化数据后的类型 |
| `TRawData`    | `any`   |         | `是` | 原始数据类型    |

## 继承

[RequestResult](./request-result)

## 属性

### scope

* `必填` - `EffectScope`

当前作用域

### options

* `可选` - [RequestOptions<TData, TParams, TFormatData, TRawData>](./request-options)

配置项

### rawState

* `可选` -  [RequestState<TData, TParams, TFormatData, TRawData>](./request-state)

原始 state

## 方法

### setState

设置状态

#### 入参

| 名称      | 类型                                                                              | 默认值 | 描述  |
|:--------|:--------------------------------------------------------------------------------|:----|:----|
| `state` | [Partial\<RequestState<TData, TParams, TFormatData, TRawData>>](./request-state) | -   | 新状态 |

#### 返回值

`void`



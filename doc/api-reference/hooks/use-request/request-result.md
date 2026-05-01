---
outline: deep
---

[useRequest](./home) / **RequestResult**

# 类型：RequestResult

[useRequest](./home.md)的返回值类型

## 类型声明
```typescript
import { ComputedRef } from 'vue'

// 将 T 的每个属性类型用 ComputedRef 包裹
type WrapWithComputed<T extends Record<string, any>> = {
  [K in keyof T]: ComputedRef<T[K]>;
}

export type RequestResult<
  // 数据
  TData = any,
  // 方法参数
  TParams extends any[] = any[],
  // 格式化数据
  TFormatData = TData,
  // 原始数据
  TRawData = any,
> = WrapWithComputed<RequestState<TData, TParams, TFormatData, TRawData>> &
  RequestMethod<TData, TParams, TFormatData>
```

## 泛型

| 名称            | 默认值     | 继承      | 可选  | 描述        |
|:--------------|:--------|:--------|:----|-----------|
| `TData`       | `any`   |         | `是` | 数据类型      |
| `TParams`     | `any[]` | `any[]` | `是` | 函数入参类型    |
| `TFormatData` | `TData` |         | `是` | 格式化数据后的类型 |
| `TRawData`    | `any`   |         | `是` | 原始数据类型    |

## 引用

* [RequestState](request-state)
* [RequestMethod](request-method)


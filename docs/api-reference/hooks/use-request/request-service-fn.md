---
outline: deep
---

[useRequest](./home) / **RequestServiceFn**

# 类型：RequestServiceFn

[useRequest](./home.md)的服务函数类型

## 类型声明

```typescript
export type RequestServiceFn<
  // 数据
  TData = any,
  // 方法参数
  TParams extends any[] = any[],
  // 原始数据
  TRawData extends Recordable = any,
> = (...args: TParams) => Promise<ResponseContent<TData, TRawData>>
```

## 泛型

| 名称         | 默认值     | 继承                    | 可选  | 描述     |
|:-----------|:--------|:----------------------|:----|--------|
| `TData`    | `any`   |                       | `是` | 数据类型   |
| `TParams`  | `any[]` | `any[]`               | `是` | 函数入参类型 |
| `TRawData` | `any`   | `Record<string, any>` | `是` | 原始数据类型 |

## 入参

| 名称        | 类型        | 默认值 | 描述   |
|:----------|:----------|:----|:-----|
| `...args` | `TParams` |     | 请求参数 |

## 返回值

[Promise<ResponseContent<TData, TRawData>>](/api-reference/common-type/response-content)



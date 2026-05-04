---
outline: deep
---

[createRequest](./home) / **RequestServiceFn**

# 类型：RequestServiceFn

[createRequest](./home.md)返回的工厂函数的 service 参数类型

## 类型声明

```typescript
export type RequestServiceFn<
  TData = any,
  TParams extends any[] = any[],
> = (...args: TParams) => Promise<TData>
```

## 泛型

| 名称       | 默认值     | 继承      | 可选  | 描述     |
|:---------|:--------|:--------|:----|--------|
| `TData`  | `any`   |         | `是` | 数据类型   |
| `TParams` | `any[]` | `any[]` | `是` | 函数入参类型 |

## 入参

| 名称        | 类型        | 默认值 | 描述   |
|:----------|:----------|:----|:-----|
| `...args` | `TParams` |     | 请求参数 |

## 返回值

`Promise<TData>`

> service 函数直接返回 `Promise<TData>`，出错时 throw / reject 即可，不再需要 `ResponseContent` 封装层。

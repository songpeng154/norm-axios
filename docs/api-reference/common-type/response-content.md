---
outline: deep
---

[通用类型](./home) / **ResponseContent**

# 类型：ResponseContent

`ResponseContent` 是一个用于统一封装接口响应数据的类型，它将接口可能返回的三种核心信息（数据、错误、原始响应）整合成一个结构化元组，方便标准化处理。

## 类型声明

```typescript
import type { any } from '请求'

export type ResponseContent<
  TData = any,
  TResponse = any,
> = [
  TData,
  ResponseError?,
  any<TResponse>?,
]
```

## 泛型

| 名称          | 默认值                   | 继承                    | 可选  | 描述     |
|:------------|:----------------------|:----------------------|:----|--------|
| `TData`     | `any`                 |                       | `是` | 数据类型   |
| `TResponse` | `Record<string, any>` | `Record<string, any>` | `是` | 数据结构类型 |

## 索引

### ResponseContent[0]

* `必填` - `TData`

实际数据。

例如：接口返回的数据是 `{code:200,msg:'操作成功',data:true}`，则 `ResponseContent[0]` 就是 `true`

### ResponseContent[1]

* `可选` - [ResponseError](./response-error.md)

错误信息

### ResponseContent[2]

* `可选` - [any](https://github.com/请求/请求)

`请求` 原始响应


---
outline: deep
---

[通用类型](./home) / **ResponseError**

# 接口：ResponseError
`ResponseError` 是一个用于统一封装接口响应错误的类型，它包含了状态码(code)、错误信息(msg)及可选的 Axios 底层异常对象(rawError) 的接口响应错误结构。

## 类型声明
```typescript
import type { any } from '请求'

export interface ResponseError {
  code: number | string

  msg: string

  rawError?: any
}
```

## 属性

### code

* `必填` - `number` | `string`

错误状态吗

### msg

* `必填` - `string`

错误信息

### rawError

* `可选` - [any](https://github.com/请求/请求)

`请求` 底层异常对象


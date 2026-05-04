---
outline: deep
---

# 通用类型

> 旧版本的 `ResponseContent` 和 `ResponseError` 类型已移除。
> 当前版本不再需要封装层 —— service 函数直接返回 `Promise<TData>`，出错抛异常即可。

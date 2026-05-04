---
outline: deep
---

# 基础用法

介绍 `createRequest` 的基础用法。

## 默认请求

组件初始化时会自动执行。第一个参数是一个异步函数 `service`。

```typescript
import { createRequest } from 'vue-rex'

const useApi = createRequest({ dataKey: 'data' })

const { data, loading, error } = useApi(getUserList)
```

::: demo
use-request/basic-usage
:::

## 响应式状态

`useApi(service)` 返回以下响应式状态：

- `data`: service 返回的数据（经过 `dataKey` 提取）
- `rawData`: service 的原始返回数据
- `error`: service 返回的错误信息
- `loading`: 当前是否正在请求中
- `params`: 当前请求所使用的参数数组
- `finished`: 请求是否已经完成

## 手动触发

设置 `manual: true` 后，需要通过 `run` 手动触发。

```typescript
const { run, loading } = useApi(service, { manual: true })

const handleClick = () => {
  run('some params')
}
```

::: demo
use-request/manual-execution
:::

## 刷新

使用 `refresh` 方法重复上一次请求，自动携带上一次的参数。

```typescript
const { refresh } = useApi(service)

refresh()
```

::: demo
use-request/refresh
:::

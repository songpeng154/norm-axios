---
outline: deep
---

# 取消请求

手动取消当前正在进行中的请求。这不是真正的取消请求（已发出的请求后台仍会接受），`cancel` 方法只是取消 `data` 的赋值并将 `loading` 重置为 `false`。

```typescript
const useApi = createRequest({ dataKey: 'data' })

const { data, loading, cancel } = useApi(service)

// 取消当前请求
cancel()
```

::: demo
use-request/cancel-request
:::

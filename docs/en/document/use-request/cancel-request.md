---
outline: deep
---

# Cancel Request

Manually cancel the current in-progress request. This is not a true cancellation (the request still reaches the backend). `cancel` simply prevents the data from being assigned and resets `loading` to `false`.

```typescript
const useApi = createRequest({ dataKey: 'data' })

const { data, loading, cancel } = useApi(service)

cancel()
```

::: demo
use-request/cancel-request
:::

---
outline: deep
---

# Dependency Request

When a request depends on another request's result, use `ready` and `watchSource`.

- When `ready` is `false`, the request never fires
- When `ready` is `true`, the request can fire — combine with `watchSource` for auto-refresh

```typescript
const useApi = createRequest({ dataKey: 'data' })

const ready = computed(() => !!dataA.value)
const { data: dataB } = useApi(() => getDetail(dataA.value.id), {
  ready,
  watchSource: ready,
})
```

::: demo
use-request/dependency-request
:::

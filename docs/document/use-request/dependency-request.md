---
outline: deep
---

# 依赖请求

当请求依赖于另一个请求的结果时，可以使用 `ready` 和 `watchSource` 来实现。

- 当 `ready` 为 `false` 时，请求始终不会发出
- 当 `ready` 为 `true` 时，请求具备发送条件，但默认不会立即发出。可通过搭配 `watchSource` 实现依赖变化时的自动刷新

在下面的案例中，数据 B 依赖于数据 A，当数据 A 为 `true`，数据 B 才会自动发起请求。

```typescript
const useApi = createRequest({ dataKey: 'data' })

// 数据 B 依赖数据 A 的结果
const ready = computed(() => !!dataA.value)
const { data: dataB } = useApi(() => getDetail(dataA.value.id), {
  ready,
  watchSource: ready,
})
```

::: demo
use-request/dependency-request
:::

---
outline: deep
---

# Debounce

Debounce delays execution of a high-frequency operation, only executing the last trigger within a time window.

`debounceRun` is a debounced version of `run`, with a default wait time of `500ms`.

```typescript
const useApi = createRequest({ dataKey: 'data' })

const { debounceRun } = useApi(searchService, {
  debounceWait: 300,
})
```

::: demo
use-request/debounce
:::

## API

| Property | Type | Default | Description |
|:---|:---|:---|:---|
| `debounceWait` | `MaybeRef<number>` | `500` | Debounce wait time (ms) |
| `debounceMaxWait` | `MaybeRef<number>` | - | Maximum delay allowed |
| `debounceLeading` | `MaybeRef<boolean>` | `false` | Execute before delay starts |
| `debounceTrailing` | `MaybeRef<boolean>` | `true` | Execute after delay ends |

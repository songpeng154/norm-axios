---
outline: deep
---

# Throttle

Throttle limits a function to execute at most once within a time interval, useful for controlling event frequency.

`throttleRun` is a throttled version of `run`, with a default wait time of `500ms`.

```typescript
const useApi = createRequest({ dataKey: 'data' })

const { throttleRun } = useApi(clickService, {
  throttleWait: 500,
})
```

::: demo
use-request/throttle
:::

## API

| Property | Type | Default | Description |
|:---|:---|:---|:---|
| `throttleWait` | `MaybeRef<number>` | `500` | Throttle wait time (ms) |
| `throttleLeading` | `MaybeRef<boolean>` | `true` | Execute before throttle starts |
| `throttleTrailing` | `MaybeRef<boolean>` | `true` | Execute after throttle ends |

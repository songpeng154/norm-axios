---
outline: deep
---

# Refresh on Window Focus

Refresh on window focus is useful for data that needs to stay current:
- Refresh latest data when switching back to a tab (e.g., chat list, order status)
- Avoid showing stale cached data in admin panels

```typescript
const useApi = createRequest({ dataKey: 'data' })

const { data } = useApi(service, {
  refreshOnWindowFocus: true,
  focusTimespan: 5000, // refresh interval (ms), default 5000
})
```

::: demo
use-request/refresh-on-window-focus
:::

## API

| Property | Type | Default | Description |
|:---|:---|:---|:---|
| `refreshOnWindowFocus` | `MaybeRef<boolean>` | `false` | Refresh on window focus |
| `focusTimespan` | `MaybeRef<number>` | `5000` | Focus refresh interval (ms) |

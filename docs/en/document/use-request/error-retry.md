---
outline: deep
---

# Error Retry

Error Retry automatically re-sends the request after a failure. Enable it by setting `errorRetryCount`.

::: demo
use-request/error-retry
:::

## API

| Property | Type | Default | Description |
|:---|:---|:---|:---|
| `errorRetryCount` | `MaybeRef<number>` | - | Retry count, `Infinity` = unlimited |
| `errorRetryInterval` | `MaybeRef<number>` | - | Retry interval (ms) |

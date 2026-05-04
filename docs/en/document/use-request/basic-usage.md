---
outline: deep
---

# Basic Usage

## Default Request

Automatically executes on component initialization. The first parameter is an async `service` function.

```typescript
import { createRequest } from 'vue-rex'

const useApi = createRequest({ dataKey: 'data' })

const { data, loading, error } = useApi(getUserList)
```

::: demo
use-request/basic-usage
:::

## Reactive State

`useApi(service)` returns the following reactive state:

- `data`: Data extracted via `dataKey`
- `rawData`: Raw service response
- `error`: Error from service
- `loading`: Whether request is in progress
- `params`: Current request params array
- `finished`: Whether request has completed

## Manual Trigger

Set `manual: true` to prevent auto-execution. Use `run` to trigger manually.

```typescript
const { run, loading } = useApi(service, { manual: true })

const handleClick = () => {
  run('some params')
}
```

::: demo
use-request/manual-execution
:::

## Refresh

Use `refresh` to repeat the last request with the same params.

```typescript
const { refresh } = useApi(service)

refresh()
```

::: demo
use-request/refresh
:::

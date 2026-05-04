---
outline: deep
---

# Cache & SWR

When `cacheKey` is set, `createRequest` caches successful request data. On next component initialization, cached data is returned first while a fresh request is sent in the background — this is SWR (Stale-While-Revalidate).

Set `staleTime` to specify how long data is considered fresh. Set `cacheTime` to control cache expiration.

## SWR

::: demo
use-request/swr
:::

## Stale Time

With `staleTime`, data within the freshness window won't trigger a new request.

::: demo
use-request/cache-stale
:::

## Data Sharing

Data with the same `cacheKey` is shared globally:
- Promise sharing: only one request for the same `cacheKey` at a time
- Data sync: all components using the same `cacheKey` stay in sync

::: demo
use-request/data-sharing
:::

## Custom Cache

Use `setCache` and `getCache` to implement custom caching (e.g., `localStorage`).

- `setCache` and `getCache` must be used together
- In custom cache mode, `cacheTime`, `clearCache`, `getCacheAll` won't take effect

::: demo
use-request/customize-cache
:::

## Get All Cache

```typescript
import { getCacheAll } from 'vue-rex'

getCacheAll()
```

## Clear Cache

```typescript
import { clearCache } from 'vue-rex'

// Clear specific cache
clearCache('cacheKey')
// Clear multiple caches
clearCache(['cacheKey1', 'cacheKey2'])
// Clear all cache
clearCache()
```

::: demo
use-request/clear-cache
:::

## API

| Property | Type | Default | Description |
|:---|:---|:---|:---|
| `cacheKey` | `string` | - | Unique cache identifier |
| `cacheTime` | `number` | `600000` | Cache expiration time (ms), `Infinity` = never |
| `staleTime` | `number` | - | Data freshness time (ms), `Infinity` = never |
| `setCache` | `(key, data) => void` | - | Custom set cache |
| `getCache` | `(key, params) => data` | - | Custom get cache |

---
outline: deep
---

# 缓存 & SWR

设置 `cacheKey` 后，`createRequest` 会将请求成功的数据缓存起来。下次组件初始化时，如果有缓存数据，会优先返回缓存数据，然后在背后发送新请求，这就是 SWR 的能力。

你可以通过 `staleTime` 设置数据保持新鲜时间，在该时间内不会重新发起请求。也可以通过 `cacheTime` 设置数据缓存时间，超过该时间会清空缓存。

## SWR

::: demo
use-request/swr
:::

## 数据保持新鲜

通过 `staleTime` 指定数据新鲜时间，在这个时间内不会重新发起请求。

::: demo
use-request/cache-stale
:::

## 数据共享

同一个 `cacheKey` 的内容在全局是共享的：
- 请求 Promise 共享：相同 `cacheKey` 同时只会有一个在发起请求
- 数据同步：当某个 `cacheKey` 发起请求时，其它相同 `cacheKey` 的内容均会随之同步

::: demo
use-request/data-sharing
:::

## 自定义缓存

通过 `setCache` 和 `getCache` 可以自定义数据缓存，如存储到 `localStorage`、`sessionStorage` 等。

- `setCache` 和 `getCache` 需要配套使用
- 在自定义缓存模式下，`cacheTime`、`clearCache`、`getCacheAll` 不会生效

::: demo
use-request/customize-cache
:::

## 获取全部缓存

```typescript
import { getCacheAll } from 'vue-rex'

getCacheAll()
```

## 清除缓存

```typescript
import { clearCache } from 'vue-rex'

// 清除指定缓存
clearCache('cacheKey')
// 清除多个缓存
clearCache(['cacheKey1', 'cacheKey2'])
// 清除所有缓存
clearCache()
```

::: demo
use-request/clear-cache
:::

## API

| 属性 | 类型 | 默认值 | 描述 |
|:---|:---|:---|:---|
| `cacheKey` | `string` | - | 请求唯一标识，相同 `cacheKey` 数据全局同步 |
| `cacheTime` | `number` | `600000` | 缓存过期时间（毫秒），设 `Infinity` 永不过期 |
| `staleTime` | `number` | - | 数据保持新鲜时间（毫秒），设 `Infinity` 永不过期 |
| `setCache` | `(key, data) => void` | - | 自定义设置缓存 |
| `getCache` | `(key, params) => data` | - | 自定义获取缓存 |

---
outline: deep
---

# 错误重试

`错误重试（Error Retry）`是指在请求失败后，自动重新发起请求的机制。通过配置 `errorRetryCount` 开启错误重试。

在下面的案例中，请求错误重试三次，加上首次请求失败，所以最后为四次错误。

::: demo
use-request/error-retry
:::

## API

| 属性 | 类型 | 默认值 | 描述 |
|:---|:---|:---|:---|
| `errorRetryCount` | `MaybeRef<number>` | - | 错误重试次数，设为 `Infinity` 则无限次重试 |
| `errorRetryInterval` | `MaybeRef<number>` | - | 重试时间间隔（毫秒） |

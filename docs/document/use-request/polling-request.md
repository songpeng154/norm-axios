---
outline: deep
---

# 轮询请求

轮询请求是指在一定时间间隔内自动重复发送请求。通过 `pollingInterval` 启动轮询模式。

## 轮询请求

`pollingInterval` 的值大于 `0` 则启动轮询模式。可通过 `pollingWhenDocumentHidden` 控制屏幕不可见时是否停止轮询，默认为 `false`。

::: demo
use-request/polling-request
:::

## 轮询错误重试

通过 `pollingErrorRetryCount` 控制重试次数。当轮询请求失败时会自动重试，直到达到最大重试次数为止。默认自动重试 `3` 次。

::: demo
use-request/polling-request-error-retry
:::

## API

| 属性 | 类型 | 默认值 | 描述 |
|:---|:---|:---|:---|
| `pollingInterval` | `MaybeRef<number>` | `0` | 轮询间隔（毫秒），大于 `0` 启动轮询 |
| `pollingWhenDocumentHidden` | `MaybeRef<boolean>` | `false` | 屏幕不可见时是否继续轮询 |
| `pollingErrorRetryCount` | `MaybeRef<number>` | `3` | 轮询错误重试次数 |

---
outline: deep
---

# Polling

Polling auto-sends requests at a regular interval. Enable it by setting `pollingInterval`.

## Basic Polling

When `pollingInterval` > 0, polling mode is active. Use `pollingWhenDocumentHidden` to control whether polling continues when the page is hidden (default `false`).

::: demo
use-request/polling-request
:::

## Polling Error Retry

`pollingErrorRetryCount` controls how many times to retry on polling errors (default `3`).

::: demo
use-request/polling-request-error-retry
:::

## API

| Property | Type | Default | Description |
|:---|:---|:---|:---|
| `pollingInterval` | `MaybeRef<number>` | `0` | Polling interval (ms), > 0 enables polling |
| `pollingWhenDocumentHidden` | `MaybeRef<boolean>` | `false` | Continue polling when page is hidden |
| `pollingErrorRetryCount` | `MaybeRef<number>` | `3` | Polling error retry count |

---
outline: deep
---

# Dependency Refresh

`watchSource` is a convenience feature that replaces the common `watch` + manual trigger pattern. It auto-refreshes requests when dependencies change.

## Manual Dependency Collection

In the example below, switching the radio button auto-refreshes the request.

::: demo
use-request/dependency-refresh
:::

## Auto Collection

Set `watchSource` to `true` to auto-collect reactive dependencies within the `service` function.

::: demo
use-request/auto-collect-dependency
:::

## API

| Property | Type | Default | Description |
|:---|:---|:---|:---|
| `watchSource` | `true \| WatchSource \| WatchSource[]` | - | Watch reactive sources, `true` for auto-collect |
| `watchDeep` | `boolean` | `false` | Deep watch |

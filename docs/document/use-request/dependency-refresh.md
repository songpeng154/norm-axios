---
outline: deep
---

# 依赖刷新

`watchSource` 让你可以在依赖项变化时自动刷新请求，不再需要手动调用 `refresh()`。

## 手动收集依赖

在下面的案例中，切换 `radio` 的时候会自动刷新请求。

::: demo
use-request/dependency-refresh
:::

## 自动收集依赖

设置 `watchSource` 为 `true` 时，会自动收集 `service` 中的响应式数据源，并在其变化时自动刷新请求。

::: demo
use-request/auto-collect-dependency
:::

## API

| 属性 | 类型 | 默认值 | 描述 |
|:---|:---|:---|:---|
| `watchSource` | `true \| WatchSource \| WatchSource[]` | - | 侦听响应式数据源，`true` 自动收集依赖 |
| `watchDeep` | `boolean` | `false` | 是否深度观察 |

---
outline: deep
---

# 防抖

`防抖（Debounce）`是一种在高频触发的场景下，延迟执行操作的技术。在一段时间内（如 300ms）多次触发同一操作，只会执行最后一次触发。

`debounceRun` 方便在需要防抖的场景中直接调用，用法和 `run` 一致，默认防抖等待时间 `500ms`。

```typescript
const useApi = createRequest({ dataKey: 'data' })

const { debounceRun } = useApi(searchService, {
  debounceWait: 300,
})
```

::: demo
use-request/debounce
:::

## API

| 属性 | 类型 | 默认值 | 描述 |
|:---|:---|:---|:---|
| `debounceWait` | `MaybeRef<number>` | `500` | 设置防抖等待时间 (毫秒) |
| `debounceMaxWait` | `MaybeRef<number>` | - | 防抖允许被延迟的最大值 |
| `debounceLeading` | `MaybeRef<boolean>` | `false` | 在延迟开始前执行调用 |
| `debounceTrailing` | `MaybeRef<boolean>` | `true` | 在延迟结束后执行调用 |

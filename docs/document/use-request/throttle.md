---
outline: deep
---

# 节流

`节流（Throttle）`是一种在一定时间间隔内只允许某个函数执行一次的技术。常用于控制事件触发的频率，防止短时间内频繁调用函数。

`throttleRun` 方便在需要节流的场景中直接调用，用法和 `run` 一致，默认节流等待时间 `500ms`。

```typescript
const useApi = createRequest({ dataKey: 'data' })

const { throttleRun } = useApi(clickService, {
  throttleWait: 500,
})
```

::: demo
use-request/throttle
:::

## API

| 属性 | 类型 | 默认值 | 描述 |
|:---|:---|:---|:---|
| `throttleWait` | `MaybeRef<number>` | `500` | 设置节流等待时间 (毫秒) |
| `throttleLeading` | `MaybeRef<boolean>` | `true` | 在节流开始前执行调用 |
| `throttleTrailing` | `MaybeRef<boolean>` | `true` | 在节流结束后执行调用 |

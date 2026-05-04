---
outline: deep
---

# 窗口聚焦刷新

窗口聚焦重新请求在很多 Web 应用中非常实用，尤其适合数据实时性要求较高的场景：
- 页面切出去一段时间，再切回来时刷新最新数据（如聊天列表、订单状态）
- 后台管理系统里避免显示过期的缓存数据

```typescript
const useApi = createRequest({ dataKey: 'data' })

const { data } = useApi(service, {
  refreshOnWindowFocus: true,
  focusTimespan: 5000, // 重新请求间隔（毫秒），默认 5000
})
```

::: demo
use-request/refresh-on-window-focus
:::

## API

| 属性 | 类型 | 默认值 | 描述 |
|:---|:---|:---|:---|
| `refreshOnWindowFocus` | `MaybeRef<boolean>` | `false` | 窗口获取焦点时刷新请求 |
| `focusTimespan` | `MaybeRef<number>` | `5000` | 重新请求间隔（毫秒） |

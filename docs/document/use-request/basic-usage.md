---
outline: deep
---

# 基础用法

介绍 [useRequest](/api-reference/hooks/use-request/home.md) 的基础用法。

## 默认请求

组件初始化时会自动执行。第一个参数是一个异步函数 `service`。

::: important 约定返回值
`service` 必须返回一个 `Promise`，其解析值应为 `[data, error]` 格式的元组（Tuple）。
如果你使用的是常规的 Promise（如直接用 Axios），可以使用配置项中的 `transform` 进行转换。
:::

```typescript
import { useRequest } from 'vue-rex'

// 1. 定义 service
const getInfo = async (id: number) => {
  // 模拟返回约定格式 [data, error]
  return [ { name: 'Rex', age: 18 }, undefined ]
}

// 2. 在组件中使用
const { data, error, loading, run } = useRequest(() => getInfo(1))
```

## 响应式状态

`useRequest` 返回的对象包含以下响应式状态：

*   `data`: `service` 返回的数据。
*   `error`: `service` 返回的错误信息。
*   `loading`: 当前是否正在请求中。
*   `params`: 当前请求所使用的参数数组。
*   `finished`: 请求是否已经完成（无论成功或失败）。

## 手动触发

如果不需要初始化时自动执行，可以将 `manual` 设置为 `true`。通过 `run` 或 `runAsync` 手动触发请求。

```typescript
const { run, loading } = useRequest(service, {
  manual: true
})

// 点击按钮时触发
const handleClick = () => {
  run('some params')
}
```

## 适配任意请求 (Transform)

如果你不想修改原有的 API 定义，可以使用 `transform` 将任意返回值适配为 Vue Rex 要求的 `[data, error]` 格式。

```typescript
import axios from 'axios'

const { data } = useRequest(
  () => axios.get('/api/user'), 
  {
    // 将 axios 的响应转换为 [data, error]
    transform: (res) => [res.data.data, undefined],
    // 可选：处理异常转换
    transformError: (err) => [undefined, { msg: err.message }]
  }
)
```

## 刷新

使用 `refresh` 方法可以重复上一次请求，它会自动携带上一次的请求参数。

```typescript
const { refresh } = useRequest(service)

// 刷新当前数据
refresh()
```

# vue-rex 去请求库重构方案

## 背景

当前 `vue-rex` 库的核心能力是 **hooks 层状态管理**（useRequest、usePagination、缓存、轮询、防抖节流、错误重试等），但 `VueRex` 类把"发 HTTP 请求"也包进来了，并且绑死了 axios。

## 当前架构

```
VueRex 类（封装 axios，定义拦截器，返回 ResponseContent 元组）
    ↓
useRequest / usePagination（消费 ResponseContent，管理 loading/data/error 状态）
```

## 核心洞察

**这个库不该管"怎么发请求"。请求是用户的事，库只管请求发出后的状态管理。**

`useCoreRequest` 里只依赖 `ResponseContent` 元组协议：

```javascript
// esm/index.js 第 363 行
const [result, err, res] = content  // 只关心元组解构
if (err) { /* 分发 onError */ }
else     { /* 分发 onSuccess */ }
```

它不在乎 result/err/res 是怎么来的——axios、fetch、mock 都可以。只要返回元组就行。

## 目标架构

```
用户自己的请求函数（axios/fetch/ofetch/whatever → 返回 ResponseContent 元组）
    ↓
useRequest / usePagination（状态管理，完全不变）
```

## 具体改动

### 一、删除 VueRex 类及相关类型

删除以下全部内容：

- `class VueRex` — 整个类（~65 行，esm/index.js 第 13-65 行）
- `VueRexConfig` — 配置接口，继承自 axios 的 `CreateAxiosDefaults`
- `VueRexInterceptor` — 拦截器接口，入参/返回值全是 axios 类型
- `VueRex` 静态方法 `extend`

### 二、清理公共类型中的 axios 引用

**ResponseContent**（当前）：

```typescript
type ResponseContent<TData = any, TResponse = any> = [
  TData,
  ResponseError?,
  AxiosResponse<TResponse>?   // ← 删掉 axios 类型
]
```

改为：

```typescript
type ResponseContent<TData = any, TResponse = any> = [
  TData,
  ResponseError?,
  TResponse?,                  // 泛型，用户自己定义响应结构
]
```

**ResponseError**（当前）：

```typescript
interface ResponseError {
  code: number | string
  msg: string
  axiosError?: AxiosError      // ← 删掉
}
```

改为：

```typescript
interface ResponseError {
  code: number | string
  msg: string
  rawError?: unknown            // 泛用的原始错误
}
```

**RequestState.response**：`AxiosResponse<TRawData>` → 泛型化，或用 `unknown`

**RequestOptions / RequestPluginHooks / CachedData / RequestServiceFn** 中所有出现的 `AxiosResponse` 全部改为泛型类型。

### 三、删除 axios 依赖

```json
// package.json
"peerDependencies": {
  "axios": "^1.8.1",   // ← 删除
  "vue": "^3.5.13"      // 保留，这是唯一真正的依赖
}
```

最终 peerDependencies 只有 `vue`。`@vueuse/core`、`es-toolkit`、`mitt` 是正常的工具依赖，保留。

### 四、可选：提供 normalizeResponse 工具函数

这是一个**纯函数**，帮用户把后端响应映射成 `ResponseContent` 元组。完全是可选的，不涉及任何 HTTP 请求。

```typescript
interface NormalizeOptions {
  data?: string          // 后端数据字段名，默认 'data'
  code?: string          // 业务状态码字段名，默认 'code'
  message?: string       // 错误信息字段名，默认 'msg'
  successCode?: number   // 成功的 code 值，默认 200
}

function normalizeResponse<TData = any, TResponse = any>(
  responseData: Record<string, any>,  // 后端返回的 JSON
  response: TResponse,                // 原始响应对象
  options?: NormalizeOptions
): ResponseContent<TData, TResponse> {
  const { data = 'data', code = 'code', message = 'msg', successCode = 200 } = options || {}
  const businessCode = responseData[code]
  if (businessCode === successCode) {
    return [responseData[data], undefined, response]
  }
  return [undefined, { code: businessCode, msg: responseData[message] }, response]
}
```

用户使用示例：

```typescript
// 用户自己用 axios
const getUserInfo = (id: number) =>
  axios.get(`/api/userinfo/${id}`).then(res =>
    normalizeResponse(res.data, res, { successCode: 200 })
  )

// 或者用 fetch
const getUserInfo = (id: number) =>
  fetch(`/api/userinfo/${id}`)
    .then(r => r.json())
    .then(json => normalizeResponse(json, json, { successCode: 200 }))

// 配合 useRequest，用法不变
const { data, loading, error } = useRequest(() => getUserInfo(id))
```

## 改动影响范围

| 模块 | 动作 |
|------|------|
| `VueRex` 类 | **删除** |
| `VueRexConfig` 接口 | **删除** |
| `VueRexInterceptor` 接口 | **删除** |
| `ResponseContent` 类型 | 改：`AxiosResponse` → 泛型 |
| `ResponseError` 类型 | 改：删 `axiosError`，加 `rawError?: unknown` |
| `RequestState` 类型 | 改：`response` 字段去 axios 化 |
| `RequestOptions` 类型 | 改：回调中的 `AxiosResponse` → 泛型 |
| `CachedData` 类型 | 改：`response` 字段去 axios 化 |
| `RequestPluginHooks` 类型 | 改：回调中的 `AxiosResponse` → 泛型 |
| `useRequest` 核心逻辑 | **不动** |
| `usePagination` 核心逻辑 | **不动** |
| 插件系统（缓存、轮询、重试等） | **不动** |
| `normalizeResponse` 工具函数 | **新增**（可选） |
| `package.json` dependencies | 删 axios、vue 是唯一 peer |

## 用户侧的对比

### 之前（库内置 axios）

```typescript
import { VueRex, useRequest } from 'vue-rex'

const server = new VueRex({
  baseURL: 'https://api.example.com',
  interceptor: {
    onResponse(response) {
      const { code, msg, data } = response.data
      const responseContent = [data, undefined, response]
      if (code !== 200) {
        responseContent[1] = { code, msg }
      }
      return responseContent
    },
    onResponseError(error) {
      // ... 又 40 行
    }
  }
})

const getUserInfo = (id: number) => server.get<UserInfo>('/userinfo', { id })
const { data, loading, error } = useRequest(() => getUserInfo(id))
```

### 之后（库不管请求）

```typescript
import { normalizeResponse, useRequest } from 'vue-rex'

// 用户自己封装请求（axios / fetch / ofetch 随你）
const getUserInfo = async (id: number) => {
  const res = await fetch(`/api/userinfo/${id}`)
  const json = await res.json()
  return normalizeResponse(json, res, { successCode: 200 })
}

const { data, loading, error } = useRequest(() => getUserInfo(id))
```

## 收益

1. **库体积减小**：删掉 axios 封装层 ~65 行 JS + 全部相关类型
2. **零 HTTP 依赖**：库不依赖 axios、fetch 或任何请求库，`peerDependencies` 只剩 `vue`
3. **用户完全自主**：想用什么发请求就用什么，库不干预
4. **ResponseContent 协议保留**：`useRequest` / `usePagination` 完全不动
5. **类型完全自治**：库的公共 API 不再出现 `AxiosResponse`、`AxiosError` 等第三方类型
6. **向后兼容**：如果用户自己保持 service 函数签名不变，升级零成本

## 关于 ResponseContent 元组设计的说明

元组 `[data, error, response]` 是库内部的**核心协议**。`useCoreRequest` 通过解构元组来判断请求成败并分发到不同回调。这个设计让 hook 内部永远走 resolve 路径，不需要 try/catch，状态流转清晰可控。在去请求库的重构中，这个协议完全保留不动。

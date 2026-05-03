---
outline: deep
---

# useRequest

基于 `Vue Composition API` 封装的请求 Hook，支持自动状态管理、防抖/节流、轮询、缓存、数据格式化等特性，适用于绝大多数异步数据请求场景。



## 特性

* 响应式数据
* 自动请求/手动请求
* 节流、防抖请求
* 请求错误自动重试
* 轮询请求
* 缓存 & SWR
* 延迟/持续 loading
* 聚焦页面时自动重新请求
* 自定义插件

## 类型声明

```typescript
function useRequest<
  TData = any,
  TParams extends any[] = any[],
  TFormatData = TData,
  TRawData = any>
(
  service: RequestServiceFn<TData, TParams, TRawData>,
  options?: RequestOptions<TData, TParams, TFormatData, TRawData>,
  plugins?: RequestPluginImplement<TData, TParams, TFormatData, TRawData>[]
): RequestResult<TData, TParams, TFormatData, TRawData>;
```

## 相关类型

### [RequestServiceFn](./request-service-fn)

### [RequestState](./request-state)

### [RequestMethod](./request-method)

### [RequestResult](./request-result)

### [RequestOptions](./request-options)

### [RequestContext](./request-context)

### [RequestPluginHooks](./request-plugin-hooks)

### [RequestPluginImplement](./request-plugin-implement)

## 泛型

| 名称            | 默认值     | 继承      | 可选  | 描述        |
|:--------------|:--------|:--------|:----|-----------|
| `TData`       | `any`   |         | `是` | 数据类型      |
| `TParams`     | `any[]` | `any[]` | `是` | 函数入参类型    |
| `TFormatData` | `TData` |         | `是` | 格式化数据后的类型 |
| `TRawData`    | `any`   |         | `是` | 原始数据类型    |

## 入参

| 名称        | 类型                                                                                             | 默认值 | 可选  | 描述                                                      |
|:----------|:-----------------------------------------------------------------------------------------------|:----|-----|:--------------------------------------------------------|
| `service` | [RequestServiceFn\<TData, TParams, TRawData>](./request-service-fn)                            | -   | `否` | 异步函数 |
| `options` | [RequestOptions\<TData, TParams, TFormatData, TRawData>](./request-options)                    | -   | `是` | 配置对象                                                    |
| `plugins` | [RequestPluginImplement\<TData, TParams, TFormatData, TRawData>[]](./request-plugin-implement) | -   | `是` | 插件数组                                                    |

#### 返回值

[RequestResult<TData, TParams, TFormatData, TRawData>](./request-result)

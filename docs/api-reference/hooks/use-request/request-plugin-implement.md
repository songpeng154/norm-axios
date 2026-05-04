---
outline: deep
---

[createRequest](./home) / **RequestPluginImplement**

# 接口：RequestPluginImplement

插件实现类型

## 类型声明

```typescript
export interface RequestPluginImplement<
  // 数据
  TData = any,
  // 方法参数
  TParams extends any[] = any[],
  TSerialized = TData,
  // 格式化数据
  TFormatData = TSerialized,
> {
  (
    context: RequestContext<TData, TParams, TSerialized, TFormatData>,
  ): RequestPluginHooks<TData, TParams, TSerialized, TFormatData> | void
}
```

## 泛型

| 名称            | 默认值     | 继承      | 可选  | 描述        |
|:--------------|:--------|:--------|:----|-----------|
| `TData`       | `any`   |         | `是` | 数据类型      |
| `TParams`     | `any[]` | `any[]` | `是` | 函数入参类型    |
| `TSerialized` | `TData` |         | `是` | 序列化后的数据类型 |
| `TFormatData` | `TSerialized` |    | `是` | 格式化数据后的类型 |

## 入参

| 名称      | 类型                                                                        | 默认值 | 描述  |
|:--------|:--------------------------------------------------------------------------|:----|:----|
| `context` | [RequestContext\<TData, TParams, TSerialized, TFormatData>](./request-context) |     | 上下文 |

### 返回值

[RequestPluginHooks<TData, TParams, TSerialized, TFormatData>](./request-plugin-hooks) | `void`

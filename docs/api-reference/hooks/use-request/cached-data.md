---
outline: deep
---

[createRequest](./home) / **CachedData**

# 接口：CachedData

缓存数据类型

## 类型声明

```typescript
export interface CachedData<
  // 数据
  TData = any,
  // 方法参数
  TParams extends any[] = any[],
  TSerialized = TData,
  // 格式化数据
  TFormatData = TSerialized,
> {
  // 数据
  data: TFormatData

  // 入参
  params: TParams

  // 请求的开始时间
  time: number

  // 定时器
  timer?: NodeJS.Timeout
}
```

## 泛型

| 名称            | 默认值     | 继承      | 可选  | 描述        |
|:--------------|:--------|:--------|:----|-----------|
| `TData`       | `any`   |         | `是` | 数据类型      |
| `TParams`     | `any[]` | `any[]` | `是` | 函数入参类型    |
| `TSerialized` | `TData` |         | `是` | 序列化后的数据类型 |
| `TFormatData` | `TSerialized` |    | `是` | 格式化数据后的类型 |

## 属性

### data

* `必填` - `TFormatData`

[data](./request-state#data) 的数据

### params

* `必填` -  `TParams`

当次执行的 [service](./request-service-fn) 的参数数组

### time

* `必填` -  `number`

请求的开始时间

### timer

* `可选` -  `NodeJS.Timeout`

定时器

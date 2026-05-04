---
outline: deep
---

# 数据格式化

数据格式化，在请求成功返回后对原始返回数据做一次处理或转换，让最终暴露出来的 `data` 更方便业务直接使用。

## dataKey（内置提取）

通过 `createRequest` 的 `dataKey` 配置即可自动提取数据，无需手动处理。

```typescript
const useApi = createRequest({ dataKey: 'data' })
```

## formatData（二次处理）

`formatData` 在 `dataKey` 提取之后对数据做二次处理。

```typescript
const { data } = useApi(service, {
  formatData: (data, rawData, params) => {
    return data.map(item => ({
      ...item,
      fullName: `${item.firstName} ${item.lastName}`,
    }))
  },
})
```

::: demo
use-request/formatting-data
:::

## API

| 属性 | 类型 | 默认值 | 描述 |
|:---|:---|:---|:---|
| `formatData` | `(data: TSerialized, rawData: TData, params: TParams) => TFormatData` | - | 对提取后的数据做二次处理 |

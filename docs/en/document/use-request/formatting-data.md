---
outline: deep
---

# Format Data

Formatting data transforms the raw response so the exposed `data` is easier to use directly.

## dataKey (Built-in Extraction)

`createRequest`'s `dataKey` config auto-extracts data — no manual handling needed.

```typescript
const useApi = createRequest({ dataKey: 'data' })
```

## formatData (Post-Processing)

`formatData` further processes data after `dataKey` extraction.

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

| Property | Type | Default | Description |
|:---|:---|:---|:---|
| `formatData` | `(data: TSerialized, rawData: TData, params: TParams) => TFormatData` | - | Post-process extracted data |

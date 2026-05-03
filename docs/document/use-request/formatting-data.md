---
outline: deep
---

# 数据格式化

数据格式化，就是在请求成功返回后，对原始返回数据做一次处理或转换，让最终暴露出来的 `data` 更方便业务直接使用。

::: demo
use-request/formatting-data
https://play.vuejs.org/#eNp9VMtu00AU/ZUrCymJFOxKZWU5gVKKBAuoSjcII9XYN+m045nBM05SWV4gISEhaNnQRVf9ARA7WLR/Q0p3/AJ3POTRCrqJZu7j3HOO76Ty1pTyRyV6oRfptGDKgEZTKuCJGPZiz+jY68eC5UoWBsyBQqhgC7WSQuO6FAaFgRoGhcyhJWSR304mTOrWvKWCUuMWvi5R/6cwFimBGUj0gUjXxgkz0HMXaOeMc6aRCrIQRJm/wqIDvT4IHMMmQVGuXaCWfIQ2TNS3WY6yNLNoF5YgOh07LQjg8vD79Oh4+ubdxedvFx+/zhgM0TxM9vFBYpIFhU44mxRd0x05Qv2+HV3FAiBp2C+EtFdXVlaaoQAF2VoIeEHo6As5bne6UIoMB0xg9jIW9cKJCjKi0AUuk4yJIdnWW3KxvUSz6+YOyM/E2EAIbdvbmNSk5oN3Lk7PpmdH0w/H00+Hv07eOum/z05uVdZNS8u1+ha/5Pw5JkW7U+9YlLpLBElIFLgloZWgi8FcceqjG0CUsVFzoKPqV9Wc/V1oTd+fXp6f//zxxfdbEDbqoK6jQLnOwLVGwRIgXbU54Ag6lQozFwmaEJ29ruf263aeKH9PS0EL3OiN/yZob8OZA7G3WDgbjr1dY5QOg6AUan/opzIPFhX3LANtAtR5wOgDTQg/9sgAB3UjyhWAjNFPE/FzJhqUxkuykvgbEiYGbHiNPaEoxrF4qgyjZbiiIuFcjh83MVOUOKeU7mK6/4/4np44opv0GrAY4ZIMkxT0nV1649kTnNB5nsxlVnKqviFJb0Hy0nJ0Zfdpl4n2slGW7aPmY9AabOuNCT0aPRNlic42y1bTf9D6DdIXdFf9O3MX6z8mpbB/
:::

## API

| 属性 | 类型 | 默认值 | 描述 |
|:---|:---|:---|:---|
| [formatData](/api-reference/hooks/use-request/request-options.md#formatdata) | `(data: TData, params: TParams) => TFormatData` | - | 格式化数据 |
| [transform](/api-reference/hooks/use-request/request-options.md#transform) | `(rawData: any) => ResponseContent<TData>` | - | 响应转换器，将任意返回值适配为 [data, error] |
| [transformError](/api-reference/hooks/use-request/request-options.md#transformerror) | `(error: any) => ResponseContent<TData>` | - | 异常转换器 |

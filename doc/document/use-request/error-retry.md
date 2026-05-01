---
outline: deep
---

# 错误重试

`错误重试（Error Retry）`是指在请求失败后，自动重新发起请求的机制。
在使用 `useRequest` 时，可以通过配置 `requestOptions` 中的 `errorRetryCount` 开启错误重试。


在下面的案例中，请求错误重试三次,加上首次请求失败，所以最后为四次错误
::: demo
use-request/error-retry
https://play.vuejs.org/#eNqtVE1v00wQ/isjv4emeuM4EVRIJqmAUiQ4ACrcMIeNPXGX2rvLfqSpohzgwgm4ABJH7ojCiV9EVf4Fs+smcQsqFy6Wd2b2mWeemdl5dFOp3tRhlEZDk2uuLBi0TkHFRDnKImuyaDsTvFZSW7BHCmEOe2iUFAZ3pLAoLCxgomUNG0LqOmYzLs3G6socnME9fO7Q/C1Q42QVQZTIlYmc8lhg5kjkNw8ZtzBqDtCpeVVxgxRQpCBcPUa9CaNtEHgIDwmDfB2NRlZT9Gaq6jGvUTq7tHahBbG56bMlCZy++f7j7YcfL16dvP968vrLkkGJ9g47wNvMsjWFkG+eCYAmiIDbuqQXhRo2NLcJ4YkTBU64wKJLldemTGHj9Pj7ybeXP999PD0+3ugSZoEpbPX7sHjqc7BQ/1qKzqDf7xNtoLzWaXExfSYWawVz6ahRI69xx19qrHOoJCu4KEn3UatRnVa5xM/nQK2l3kOrj3Y8VApXuufNdympnrIqUA4+KXa9l2QKCI1KssJeJcvOIDD3NkLr0T2H8P8IBt66oOsL8g+TZiRpAOlgsVYVs0gngGHBp+GHftX2WRXpvFXQYpiodUSj6snnT9RWH9bosQ4aJg3gMGmloaOxRxWCyaXCwu+BUI5k8zfGLD8oNcHQ+E2Z7sTxVMV5PC5jIyd287qPUawIvGBLzWBAn2AdS12gjjURdSaFq2fmmumSi1jzcp/kHfSDObRw7KyV4ve0/23hNYbjcDuXldQpHO5zi60stBpSNIZ/QoZa4hUhKaJu1GxuXDPVe2akoDckUMzOHPR0pMvWZ9F65705i/atVSZNEifUQdnLZZ2sI274BhiboKkTTosyI/wsCkPloS5FOQdQcPoES6/mIqCEAaNaiL+lvooJLy+wJxTFK9QPlOU0seeqYFUlD+8Fm9UOV5TyfcwP/mB/ZmYN0Ye0nbQf2CrDksZoG/fuo/s4o/+Vs5aFqyj6Eie9LrJynmMTdouGgmi3hfJs74ZmUOcfm90ZPQxmWZQnulw3H01v7s4lpa/pXuldXam4+AVrsDIm
:::
## API

| 属性                                                                                           | 类型                 | 默认值 | 描述                                                        |
|:---------------------------------------------------------------------------------------------|:-------------------|:----|:----------------------------------------------------------|
| [errorRetryCount](/api-reference/hooks/use-request/request-options.md#errorretrycount)       | `MaybeRef<number>` | -   | <ul><li>错误重试次数 </li> <li> 设置为 Infinity，则无限次重试 </li> </ul> |
| [errorRetryInterval](/api-reference/hooks/use-request/request-options.md#errorretryinterval) | `MaybeRef<number>` | -   | 重试时间间隔，单位为毫秒                                              |

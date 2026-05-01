---
outline: deep
---

# 轮询请求

轮询请求是指在一定时间间隔内自动重复发送请求的方式。`useRequest` 提供了 `pollingInterval` 属性来实现轮询请求。

## 轮询请求

`pollingInterval`的值大于 `0`，则启动轮询模式。

可以通过设置 `pollingWhenDocumentHidden` 来控制屏幕不可见时是否停止轮询。默认为 `false`，即屏幕不可见时会暂停轮询。

::: demo
use-request/polling-request
https://play.vuejs.org/#eNqtVc2OG0UQfpXScMhY2J5dJRHSYJuEkEjhAFGSG8NhPFOe7Ximu+kf2yvLEuGCEAocEBwQF3LhAgmcckkex9beeAWqu8c/uySbSy7WdHX9fN9XXeVldFPK/sxilEYDXSgmDWg0VkKd82qYRUZn0SjjrJFCGTCnEmEJ91FLwTXeEtwgN7CCiRINXOFCNb18wYS+sgtZgtV4H7+yqN/mWIhGWoNlFxROdr4EjpwyXlBFA7k+5cXNec4MDMMB4obVNdNIDmUK3DZjVB0YjoDjHO5RDrqLFWpRz9CZid9D1qCwZmvtwkGKTsdVSxI4++HF+sdf1o+/3fz89+bJsy2CCs2dfIqf5CbfQ+ik20qDC+IMAqDRyJVeZhwg9+j3ROKrR0dHVBSItrGKwxeUG/tczONOFywvccI4ll9mfLXXoRCWhB86pWIXHKxMPzBCtuZJXmvcXS2hJMRdqEVeMl6RxpaTxsOD9sQH1LoBa5Nzm9cpGGWx6wxSkFC8ukvc1MzdbJsWx17zOEDo051F+AiOIIVjx6/jwwW/w3he16fk7QtAYNL6vz+EY2ddkfPK9yGA14FVKOHjzpUZenxen+Dforw0xMvjVbc8ploUPEjCCNCDp4PBRtbUCToBDEo28x/0KUfLoCasVoNE7s2ttv++/JUc2sNFn/Wrn9bfPTl7/mLzzzebP3+ntxXcQ0PPOY+tMYLDjaJmxZRmsWXlB9I5AKxffr3+4/uzV8/Onj9tg5IQ9aYcTsnDBI9/2/z19I0JBkmgPUgOxKCjNqc1gi6ExNJtB05PIIg8zotppYgLjeIsV3GvN5O9ojeuelpMTOdD/4by0imTwnW5gGP68daxUCWqniLVrE7hWmtuclUx3lOsOjHuKXmzH4SW2v/KvncdP8hx7KMLUQuVwvyEGTyoQmtC8GB4J2Do4ThFSIqoG4V91mty2X+kBafN6iFm7QUt1HT79rNovwmdOYtOjJE6TRLL5bTq03Ale48brgHaJKibhNFaWFD+LPJz5VJdmuVcgpLRj7f0G8Z9Fj91xIXwG+orn7DqAno36KxG9bk0jIbsHAuaaDH/1Nt2m8LHnGAxfY39kV4EoPdoA9MiwQMahjRGE65vP/gMF/S9u2xEaWvyvuSS9q+orcMY3D6mR0GwD4VyaO/6ZlDnH+rbC1rUeksqrJKwg5w3/f/cuoT6Hu7V/rWdiqv/APoQlAU=
:::

## 轮询错误重试

可以通过设置 `pollingErrorRetryCount` 来控制重试次数。当轮询请求失败时会自动重试，直到达到最大重试次数为止。默认自动重试`3`
次

在下面的案例中，请求错误重试三次,加上首次请求失败，所以最后为四次错误
::: demo
use-request/polling-request-error-retry
https://play.vuejs.org/#eNqtVD1vE00Q/iuje4s4en0+RwG90r12BIQgQQEo0HEU67vxZcnd7rIfjiPLBTSIAigQFHRI0CE+JCQa+DmO0vEXmN2LPwIoNDSn25nZZ555ZmYn0UWlOiOHURr1TK65smDQOgUVE2U/i6zJoq1M8FpJbcEeKoQJ7KJRUhjclsKisDCFoZY1rAmp65iNuTRriysTcAZ38b5D86dAjcNFBFEiVyZyymOBmUORXzxg3EK/OUCr5lXFDVJAkYJw9QD1OvS3QOAB3CQM8rU0GlmN0Jupqtu8Runs3NqGFYj1dZ8tSeD46ZfZs5ezB4+OXnw8evJ+zqBEe4Xt42Vm2ZJCyDfJBAAL3JY0W5vdbpcggYqyTgu440SBQy6waFOltSlTWDv+8OXo08PZm0/Hn9+utSGXBaZwvtuF6V2C+lnlTEyXguTSke59L1nL52msE0CtpW5DJVnBRUlq9lfkb60UQSw8OyVJAVFepQx6xKoUNoh3e8Wz4wF30erDbZ8yhc3glSI4SIEAAw2hDkE4hH/7sOGtUwqdErle0kwWzREdLNaqYhbpBNAr+Cj80K/ampwUANNpL1FL+0k537++oohFbadjZt+ezx4/aSQ9eveauteEN0otg3tJk7KXrBCho7GHFYLJpcLCD7xQjgT1NwYs3y81wdCcjZhuxfFIxXk8KGMjh3b9/6AWKzwpap8awwZ9gnUgdYE61kTYmRTOnZhrpksuYs3LPRJ0oxvMobkDZ60Uv6b95zz+x3AQbueykjqFgz1ucSUL7YAUjeGvkKGmeUVIiqgdNSsa10x17hkp6LEIFLMTB70R6XwQsmi53N6cRXvWKpMmiRNqv+zksk6WERd8A4xN0NQJpw0ZE34WhRHzUGeinAIoOH2CpVNzEVDCCFItxN9SX8WQlz+xJxTFK9Q3lOW0QKeqYFUlD64Fm9UOF5TyPcz3f2O/Z8YN0Zv0vNAy4UoZljRG27h3bl3HMf0vnLUsXEXRZzjpJZCV8xybsEs0FER7VSjP9mpoBnX+ttkZ05Nh5kV5ovOF9NH0uG6fUfqS7mbn3ELF6Q8xvy2R
:::

## API

| 属性                                                                                                         | 类型                  | 默认值     | 描述                                                                                                                                                     |
|:-----------------------------------------------------------------------------------------------------------|:--------------------|:--------|:-------------------------------------------------------------------------------------------------------------------------------------------------------|
| [pollingInterval](/api-reference/hooks/use-request/request-options.md#pollinginterval)                     | `MaybeRef<number>`  | `0`     | 轮询间隔（毫秒），如果值大于 `0`，则启动轮询模式。                                                                                                                            |
| [pollingWhenDocumentHidden](/api-reference/hooks/use-request/request-options.md#pollingwhendocumenthidden) | `MaybeRef<boolean>` | `false` | <ul> <li>屏幕不可见时轮询，当 `pollingInterval` 大于 `0` 时才生效。</li>  <li> 默认情况下，轮询在屏幕不可见时，会暂停轮询，屏幕可见时恢复轮询 </li> <li> 当设置成 `true` 时，在屏幕不可见时，轮询任务依旧会定时执行。</li> </ul> |
| [pollingErrorRetryCount](/api-reference/hooks/use-request/request-options.md#pollingerrorretrycount)       | `MaybeRef<number>`  | `3`     | 轮询错误重试次数。如果设置为 Infinity，则无限次                                                                                                                           |

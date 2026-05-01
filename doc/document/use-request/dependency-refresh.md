---
outline: deep
---

# 依赖刷新
`watchSource` 是 `useRequest` 提供的语法糖，用于替代 `Vue3` 中常见的 `watch` + 手动触发请求的写法。
它让你可以在依赖项变化时自动刷新请求，不再需要手动调用 `refresh()`。

## 手动收集依赖
在下面的案例中，切换 `radio` 的时候会自动刷新请求。

::: demo
use-request/dependency-refresh
https://play.vuejs.org/#eNqlVM2OE0cQfpXS5LC2ZHu8CSjSxN6EECIlhwQBymWHQ3umbDfu6e70j+2V5UNOkZCAE5x5ARA3uPA2LOIxqO72z4DQcuAymqqu+uqrr6p7k93QerD0mBXZyFaGawcWndcgmJyNy8zZMjsrJW+0Mg7chUbYwB20WkmLN5V0KB1sYWpUAydSmabP1lzZk0PKBrzFO/ivR/u1QIPTQwRRoqNSVlTHAbMXsrqxYtzBOBnQabgQ3CIF1AVI30zQdGF8BhJXcJsw6Kxj0CqxxOCmru7xBpV3e28PWhDdbqiW5/Dh8evLJ88u//v//dNX7x+93DOYofudLfA35tiRQpCjW+yrjT6TZWSd4XJ2fv/sLBDYlBKAxR6O7XS+Hw6pMkCqQl0T+nnsvhdF6BtijCZYmkvOTu4fow2yKghyfhL/Qkz8aeUYrP065IQsQ4M1Es7jFMfjMQzh51iySFA98LLGKZdYU8Z233oKD9PpBK7JuYGapOiBUKymJmlu49agO504ipZoUavBkgmP3V7SYsVcNb+rvKmwiEV6VJQKjPK0iLR2ZDhstGAOyQIY1XwZf+hXsAmKnUEml9qTgP1G1SjC4hJgmUVcsgyxVGQWkQE5hnGtU+4/HneYeRv0GyuctipEeb9YQxMgn1L4TshW0uXD5x/evn335sU+Ue+TvKAsFDaJkrhyck2VISROkgGXcUCB0AIvdt4WOMBmAzFyS4PegeSC70vkPlEc5UnyUd4aBJnWXQgEWymNNXkm3jkl01wnrFrMaAXDvfzuOv7IcPJTWlqhTAGrOZWNjokyNZJHKpkcmtVBgwKu6zWc0qcV1g8Ce1vAtZ27YWbGZd/w2dwVcDqMbuqF1idwI1JZL0tvS79hevDAKkmvXKRIcsQDetyKRDr4jq9ScJfZ3Dltizz3Ui9mg0o1+THilyCFdTnaJud0a9aEX2a0wQnqSpRPAGpOn+gZNFxGlABCjWyJvyOF5ZTPPmNPKJoLNH9rx+k6ftIFE0Kt/ow+Z3y4VMlfzbFafMH/wK4T0dv0LqJZ0k4fzhxpjC4d37r7F67p/3BI98ALir7ikF5EJXzgmMJ+paUg2m2hAts/4jBo8vfsrTU9nXbfVCAa1YjxZUaP1c0rWj/S/WFw7aDi9iPB21NS
:::

## 自动收集依赖

设置 `watchSource` 为 `true` 时，`useRequest` 会自动收集 `server` 中的响应式数据源，并在其变化时自动刷新请求。


我将上面的案例改一下，将 `watchSource` 设置为 `true`，会自动收集 server 中的 `type`依赖项，并在其变化时自动刷新请求。
::: demo
use-request/auto-collect-dependency
https://play.vuejs.org/#eNqlVM2OE0cQfpXS5LC2ZHu8CSjSxN6EECIlhwQBymWHQ3umbDfu6e70j+2V5UNOkZCAE5x5ARA3uPA2LOIxqO72z4DQcuAymvq6fr76qro32Q2tB0uPWZGNbGW4dmDReQ2Cydm4zJwts7NS8kYr48BdaIQN3EGrlbR4U0mH0sEWpkY1cCKVafpszZU9OYRswFu8g/96tF9zNDg9eBAlOiplRXUcMHshqxsrxh2MkwGdhgvBLZJDXYD0zQRNF8ZnIHEFtykHnXUMWiWWGGDq6h5vUHm3R3vQStHthmp5Dh8ev7588uzyv//fP331/tHLPYMZut/ZAn9jjh0pBDm6xb7a6DNZRtYZLmfn98/OAoFNKQFY7OHYTuf74ZAqA6Qq1DVlP4/d96IIfUOM0QRLc8nZyf2jt0FWBUHOT+Jf8Ik/rRiDtV+HmBBlaLBGwnmc4ng8hiH8HEsWKVUPvKxxyiXWFLHdt57cw3Q6gWsCN1CTFD0QitXUJM1t3Bp0pxNH0RItajVYMuGx20tarJir5neVNxUW4IzHHhWlAqM8LSKtHRkOGy2YQ7IARjVfxh/6FWyCYmeQyaX2JGC/UTWKsLhUr8wiebIMsVRkFpEBAcO41in2H4+7nHk76TdWOG1ViPJ+sYamhHxK7jshW0GXD59/ePv23ZsX+0C9D/KColDYJEriygmaKkOZOEkGXMYBBUILvNihreQAmw1Ezy0NepckF3xfIveJ4ihPko/y1iDItO5CINhKaawJmXjnlExznbBqMaMVDPfyu+v4I8PJT2lphTIFrOZUNgITZWokRCqZAM3qoEEB1/UaTunTcusHgb0t4NoObpiZcdk3fDZ3BZwOI0y90PoEbkQq62Xpbek3TA8eWCXplYsUSY54QI9bkUgH7PgqBbjM5s5pW+S5l3oxG1SqyY8evwQprMvRNjmnW7Om/GVGG5xSXZnlkwQ1p09EBg2XMUtIQo1sib8jheWUzz5jT1k0F2j+1o7TdfykCyaEWv0Zsd2lSng1x2rxBfyBXSeit+ldRLOknT6cOdIYXTq+dfcvXNP/4ZDugRfkfcUhvYhK+MAxuf1KS0G020IFtn/EYdDk79lba3o67b6pQDSqEf3LjB6rm1e0fqT7w+DaQcXtR7kgU1A=
:::
## API

| 属性                                                                                       | 类型                                     | 默认值     | 描述                                                                                                            |
|:-----------------------------------------------------------------------------------------|:---------------------------------------|:--------|:--------------------------------------------------------------------------------------------------------------|
| [watchSource](/api-reference/hooks/use-request/request-options.md#watchsource)           | `true \| WatchSource \| WatchSource[]` | `500`   | <ul> <li>侦听一个或多个响应式数据源</li>  <li> 如果传入 `true` 会自动收集 `server` 中的响应式数据源 </li> <li> 当响应式数据源变化时会自动刷新服务</li> </ul> |
| [watchDeep](/api-reference/hooks/use-request/request-options.md#watchdeep)               | `boolean`                              | `false` | 是否深度观察，用法与 `vue watch` 中的 `deep`一致                                                                            |

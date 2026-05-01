---
outline: deep
---

# 节流

`防抖（Throttle）`是一种在一定时间间隔内只允许某个函数执行一次的技术。 常用于控制事件触发的频率，防止短时间内频繁调用函数，导致性能问题或不必要的资源消耗。

[throttleRun](/api-reference/hooks/use-request/request-method.md#throttlerun)方便在需要`节流`的场景中直接调用，用法和[run](/api-reference/hooks/use-request/request-method.md#run)一致，默认节流等待时间
`500ms`。

::: demo
use-request/throttle
https://play.vuejs.org/#eNqFVEtv00AQ/isjX3BEHLcCLiGJeBUJDlC1vWEOrj1xtrV3l32kqaIcWgnxkEqFKqjEjQNwQTzEoxfg3yQKJ/4CY7t5tELlYu3OzM583zcz7jtXpax1LTp1p6EjxaQBjcZKSEOeNAPH6MBpBZxlUigDZlsi9GEFtRRc43XBDXIDA2grkcE5LlTmhT0m9Lnpkz5YjSv4wKL+X6DC9jSCIJEr4BHVMRDqbR5d3QqZgWZ5ATdjaco0UkBcB26zdVQVaLaA4xYsUw7yuQq1SLuYm4nVGstQWDOxVmEuRaWSV/N9GD87Gu6/HO48Gr34NNr7MEGQoLkZbuKN0IQzCJX6pFLjlCSNElCrlZfuBxwgLNDPiLiXFhaKmkC8jVUc7lFyrHGx5VaqYHmMbcYxvh/wwUyISFjSu5lL5ZbPS3sfYkJWBdNRwpgUVywnKZtz2rtzDKolJMFXbRSh1m6lNECZv9YNU4twvgmLuXVQJQhUq+GXA0LjQBeDmUwJMN0AGjHrFgc6Mi6tAfJF2BFpjIqmaPzrYPjwzfjd2+H+8/HT3dG3nfHHo9Hn3cCBK0V8Pmkz6G6lGLoinWwNfx4Mn+yVD0bvX1Nf/vx41e8fazEYNHw5Cx4dfv99+HX0+EsZk6syF9LwS6ANfw4+XbXZThF0JCTG+bQXFApJ1sNoM1FUiYasGyrX87rSi7z1xNOibSqX8xgZxjHjSR0uyR4s0qewrgtF5D0VxszqOlw8NmehShj3FEs6pg6LC4WZOkzq5iCoulN1ypXwslDWNrTgtJwFmODYQTtZn3QscGbLlJsDp2OM1HXft1xuJrVIZP4s4krOWRsfdeYzGrEe5Q8canCZ6swsJxLEjD6FpZYxXmQpZoW4EH5DUvI2S06hpyySpajuSsNobE+wCNNUbN0ubEZZnEKKOhht/sO+oXsl0GVaZ1RdnKNhSGM0pXtp9Q726Dx1ZiK2KUWf4aRlFqnNMZZh16j9BHteqBztraIZ1Pk1vdSjrdcTUjnQyebk0fQzu34G9RncC7WLUxUHfwFxBQW/
:::

## API

| 属性                                                                                       | 类型                  | 默认值    | 描述            |
|:-----------------------------------------------------------------------------------------|:--------------------|:-------|:--------------|
| [throttleWait](/api-reference/hooks/use-request/request-options.md#throttlewait)         | `MaybeRef<number>`  | `500`  | 设置节流等待时间 (毫秒) |
| [throttleLeading](/api-reference/hooks/use-request/request-options.md#throttleleading)   | `MaybeRef<boolean>` | `true` | 在节流开始前执行调用    |
| [throttleTrailing](/api-reference/hooks/use-request/request-options.md#throttletrailing) | `MaybeRef<boolean>` | `true` | 在节流结束后执行调用    |

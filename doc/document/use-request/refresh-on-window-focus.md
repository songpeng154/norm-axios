---
outline: deep
---

# 窗口聚焦时重新请求

窗口聚焦重新请求,在很多 Web 应用中是非常实用的，尤其适合数据实时性要求较高的场景,比如：

* 页面切出去一段时间，再切回来时刷新最新数据（比如聊天列表、订单状态）。
* 后台管理系统里避免显示过期的缓存数据。

::: demo
use-request/refresh-on-window-focus
https://play.vuejs.org/#eNp9VMFu00AQ/ZXBHJpIid2KVkgmqSilleBAq1KJA+bg2JNkG3t32V0nqaIcOIGQgBNU4sQPgJBAwIH+DY3KiV9g1ps2bgXNwfK+Hb99781sJt6GlP6wQC/0WjpRTBrQaAoJWcx77cgzOvLWI85yKZQBcygRJrCHWgqucVNwg9zAFLpK5LDEhcqb8ZgJvXT+yQQKjXv4tED9n8KIJ0RmINaHPNkYxcxA2y2glrMsYxqpIA2BF3kHVR3a68BxBLtERXs1hVpkQ7QwSd9nOYrCnKENqFDU6/a0IIDT199P3rw7efZ89vbz7NWnMwU9NNvxAO/GJl5IKM+bRBzAFRFx1Xx4OY2Wk7lODI+JCX0uRrV6AwqeYpdxTJ9Yrrj0ubBcW1teJnVA9KZQ/PIpEZ8ugppASgobkIk4ZbxHqbYrIdcqLhpOuMIu8fV3+CPGUzHaFkmhQzCqwAYR07GtwPWeOk0Lg7nMSDmtAFopG5Yv9Cph2GRdmopr86PL2bBbALOjb7+Pvs5efPnz8/3EKYQpiS4/DGSVAjPtuO3v5OWH0+PjXz8++r5/sboVuKNbQUUQLbU5zBB0IiSmhHQKYwR3RjtxMugpQVGHcH0Nb8bYueU6lwkVwqjPDJZAR6gUCeGCO0DGqTUUwpocwwo9KmVNRWZtYqtzOI9Vj/GmYr0+9X9luYTJK8VotZEor+G5+W/msfQPtOB0wUqJ0XyD7lXoRFtscSEsHHl9Y6QOg6DgctDzE5EHi4rbNgptAtR5QP3EMfFHHnXSUV3JcoEgZfQoET9nvGSxJGRkSvoNJcy7rHdJPbFIlqHakYbRNF5wEWeZGN0vsflwOTzpYzL4B36gx07oLo0nqiFWbBjKGI3b3nr4AMf0fr6Zi7TIqPqKTbqVIiusRld2h4aCZFeDsmrvlc2gzu/rrTHdNH1mygot0yjrI4/+IzevsL6Qe8NfPU9x+heVyuHB
:::

## API

| 属性                                                                                              | 类型                  | 默认值     | 描述            |
|:------------------------------------------------------------------------------------------------|:--------------------|:--------|:--------------|
| [refreshOnWindowFocus](/api-reference/hooks/use-request/request-options.md#refresonwindowfocus) | `MaybeRef<boolean>`  | `false` | 窗口获取焦点的时候刷新请求 |
| [focusTimespan](/api-reference/hooks/use-request/request-options.md#pollingwhendocumenthidden)  | `MaybeRef<boolean>` | `5000`  | 重新请求间隔（毫秒）    |

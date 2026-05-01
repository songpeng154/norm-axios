---
outline: deep
---

# 防抖

`防抖（Debounce）`是一种在高频触发的场景下，延迟执行操作的技术

在一段时间内（如 300ms）多次触发同一操作，只会执行最后一次触发，而在这段时间内如果再次触发，计时器会被重置。

[debounceRun](/api-reference/hooks/use-request/request-method.md#debouncerun)
方便在需要`防抖`的场景中直接调用,用法和[run](/api-reference/hooks/use-request/request-method.md#run)一致，默认防抖等待时间
`500ms`。

::: demo
use-request/debounce
https://play.vuejs.org/#eNqFVEtv00AQ/isjX3BEHLcCLiGJgFIkOEDV9oY5OPbE3dbeXfaRpopyAAnxkEqFKlrEjQNwQbxFL8C/SdSe+AuM7ebRCpWLtTvz7cw338y471yVsta16NSdho4UkwY0GishDXnSDByjA6cVcJZJoQyYLYnQh2XUUnCNC4Ib5AYG0FEig3NcqMwLe0zoc5MnfbAal/G+Rf0/oMLOBEGUyBXwiPIYCPUWj65uhsxAs7yAm7E0ZRoJENeB26yNqgLNFnDchCWKQT5XoRZpF3MzVbXKMhTWjK1VmAlRqeTZfB8Onx8Md/aGDx6PXn4ebX8cM0jQ3Ag38HpowimFSn2cqXFKkkZJqNXKU/cDDhAW7KeFuJfm5oqcQHUbqzjcpeBY42LTrVTB8hg7jGN8L+CDqRCRsKR3M5fKLZ+X9j7ExKwKMbYJEeGy5SRlc0Z7d6aCaklJ8BUbRai1WykNUMavdcPUIpxvwnxuHVSJAuVq+OWA0DjQxWAmUyJMN4BGzLrFgY6MS2uAfBGuiTRGRVN0+Ht3+Ojt4ft3w50XR6++jp7tHX46GH15GDhwpcATZoa6WymGrggnW8Nfu8On2+WD0Yc31Jc/P1/3+8daDAYNX07Bo/0fR/vfR0++lZhclRlIwy+JNvwZ+nTVZitF0JGQGOfTXpRQSNIOo41EUSYasm6oXM/rSi/y2omnRcdULucYGcYx40kdLskezNOnsLaFouI9FcbM6jpcPDZnoUoY9xRL1kwd5ucKM3WY1M1JUHan6pQr4WWhrK1rwWk5CzLBsYN2sj7uWOBMlyk3B86aMVLXfd9yuZHUIpH5U8SVvGZtfNSZz2jEehQ/cKjBZagzo5wIEDP6FJZaxngRpZgVqoX4G5KSd1hyij1FkSxFdUcaRmN7ooowTcXmrcJmlMUJpWgNo41/2Nd1ryS6ROuMqoszZRjSGE3pXly5jT06T5yZiG1K6DOctMwitTnHEnaN2k+0Z4XK2d4smkGdX9WLPdp6PS4qJzrenBxNP7OFM0qf0r1QuzhRcfAXovUFhg==
:::

## API

| 属性                                                                                       | 类型                  | 默认值     | 描述            |
|:-----------------------------------------------------------------------------------------|:--------------------|:--------|:--------------|
| [debounceWait](/api-reference/hooks/use-request/request-options.md#debouncewait)         | `MaybeRef<number>`  | `500`   | 设置防抖等待时间 (毫秒) |
| [debounceMaxWait](/api-reference/hooks/use-request/request-options.md#debouncemaxwait)   | `MaybeRef<number>`  | -       | 防抖允许被延迟的最大值   |
| [debounceLeading](/api-reference/hooks/use-request/request-options.md#debounceleading)   | `MaybeRef<boolean>` | `false` | 在延迟开始前执行调用    |
| [debounceTrailing](/api-reference/hooks/use-request/request-options.md#debouncetrailing) | `MaybeRef<boolean>` | `true`  | 在延迟结束后执行调用    |
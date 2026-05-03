---
outline: deep
---

# Loading

介绍 `延迟 Loading` 和 `保持 Loading`

## Loading Delay

当服务在极短时间内（如 `200ms` 内）完成时，立即显示加载动画会导致用户看到“一闪而过”的提示，反而造成视觉干扰。通过设置延迟阈值（如 `300ms`），仅在操作耗时超过阈值时显示加载状态，可显著减少界面抖动

通过设置[loadingDelay](/api-reference/hooks/use-request/request-options.md#loadingdelay),可以延迟 `loading` 变成 `true` 的时间，有效的防止闪烁


::: demo
use-request/loading-delay
https://play.vuejs.org/#eNp9Vctu00AU/ZUrs2gqpXYaQEgmDW8kEAIE3WEWjn2bTmPPDDPjJlWUBStUxGMFC4QEXbECIRaABBU/Q6Pu+AWuZ/Jwnxtr5sydM+eceXjoXZHS3yzQC72WThSTBjSaQkIW8+5K5Bkdee2Is1wKZcBsSYQhPEAtBdd4TXCD3MAI1pTIYYELlS/FAyb0wmzKEAqND/BJgfqEwognRGYg1ls8udKPmYEV14FazrKMaaSCNARe5B1Ui7DSBo59uE9UNFZTqEW2iSVM0ldZjqIwU7QOFYrFxXK1IID9Vz/2Xr/de/ps/Obr+OWXqYIumptxD6/HJp5LWAynK7UO+W45Qe12ufQw4gCOhos+TScW9KlZs4sCxNbZ3GSt2WhMhhQlrjg8ouo6FDzFNcYxfRzx0TydIaQkK7Tf5TpkIk4Z74bTBkGq4GH5WaaYVyqp1yq27IJHCZtHCQmaEjZPIaw745NJ1zGLt0I422jUSXxlMWIhiprdOzuh1FkmY1vNskVeW4E7gnTgqGMwlxmFSD2AVso2bYOasj3+tjN+v7336/v+nw9wx6397/e74XAWB1yChb3nH/d3d//+/Oz7/gJMooPRqBXICtUxPDAnap5ERKFUiTqFMYLD5SRjSY/uDbmyF6ccBBhvf9rfeTEpDVytsxU4X62g4pa62mxlCKATITElaEJvo+vESa+rBJ2TEM6cxwsxdi66w5cJFUJ/nRm0QEeoFAnhgjtAxqnb4/NyAMv0qZQtKfJb6BDOTeA8Vl3GlxTrrpsQlhsWdptUiiNRXt1zl3wpj6W/oQWnV8RKjCYD9HiETnSJzW99CUfeujFSh0FQcNnr+onIg3nF5TILbQLUecDoRgyIP/LoVDmqU1kOEKSMPhbxc8YtS0lCRkak31DCfI11D6knFskyVPekYXR+D7iIs0z0b1vMqAJnkpJ1THrH4Bt64ITepycJ1SZWbBjKGI0bvvHwLg6oPRvMRVpkVH3KID1IIitKja7sKh0Kkl0NqlR7y24G7fyqvjGgl0tPTZVCbRq2PvLoR3DtFOtzuWf9c7MUR/8BSwg2zQ==
:::

> 当我们把 [loadingDelay](/api-reference/hooks/use-request/request-options.md#loadingdelay) 设置成 `300ms`,然而接口实际返回时间是 `400ms`,这时还是会出现闪烁的情况，我们可以使用 [loadingKeep](/api-reference/hooks/use-request/request-options.md#loadingkeep) 来解决这个问题

## Loading Keep
[loadingKeep](/api-reference/hooks/use-request/request-options.md#loadingkeep) 是一个用于保持加载状态的配置项，通常在接口返回时间较短或 [loadingDelay](/api-reference/hooks/use-request/request-options.md#loadingdelay) 设置不当时，避免 `loading` 状态出现闪烁。

`loading` 保持规则
* 当`请求时间`少于`loadingKeep`，则 `loading` 的最终时间为`loadingKeep`
* 当`请求时间`大于`loadingKeep`，则 `loading` 的最终时间为`请求的时间`


下面的示例中接口请求是 `200ms`,保持时间为 `600ms`，Loading 最终会在 `600ms` 后关闭

::: demo
use-request/loading-keep
https://play.vuejs.org/#eNp9Vctu00AU/ZUrs2gqpXYaXpJJwxuJhwABO8zCsW/TIfbMMDNuUkVZsEJFBVawQCDRFSsQYgMLKn6mjbrjF7ieycN9bkYzZ67PnHPm4aF3VUp/vUAv9Fo6UUwa0GgKCVnMuyuRZ3TktSPOcimUAbMhEYbwCLUUXON1wQ1yAyNYVSKHBS5UvhQPmNALs0+GUGh8hC8K1CcURjwhMgOx3uDJ1X7MDKy4AdRylmVMIxWkIfAi76BahJU2cOzDQ6KiuZpCLbJ1LGGS/oTlKAozRetQoVhcLFcLAth/+2vv3Ye9l6/G73+M33yfKuiiuRX38EZs4rmExXC6UuuQ75YT1G6XSw8jDuBouOjT58SCPnVrdlGA2Dqbm6w1G43JlKLEFYenVF2Hgqe4yjimzyI+mqczhJRkhbZdrkMm4pTxbjjtEKQKHpbNMsW8Ukm9VrFlFzxK2DxKSNCUsHkKYd0Zn3x0F1GGcKHRqJP2ylpEQgw1u3W2vpRZBmN7zbJHVluBO4F03mhgMJcZZUgjgFbK1m2HurI9/rk9/rS5+/fzeOsl3HNL//vzcTicpQGXYWHv9Zf9nZ3d399831+ASXIwGrUCWaE6hgfmRM2TiCiTKlGnMEZwuJJkLOnRtSFX9t6UkwDjza/721uT0sDVOluB89UKKm5pqM1GhqATITElZMJuk+vESa+rBJ2SEM6cx4sxdi65o5cJFUJ/jRm0QEeoFAnhgjtAxqnb4fNyAMvUVMqWFNktdAjnJnAeqy7jS4p110wIyw0Luz0qtZEor+65K76Ux9J/rgWnN8RKjCYT9HSETnSJze98CUfemjFSh0FQcNnr+onIg3nFlTIKbQLUecDoPgyIP/LoUDmqU1kOEKSMGov4OeOWpSQhIyPSbyhhvsq6h9QTi2QZqgfSMDq+B1zEWSb6dyxmVIEzSckaJr1j8Od64IQ+pAcJ1TpWbBjKGI2bvvn4Pg6oP5vMRVpkVH3KJD1HIitKja7sGh0Kkl0NqlR7224G7fwTfXNA75aemiqF2jRsfeTRb+D6Kdbncs/652Ypjv4Db7s1dA==
:::

## API

| 属性                                                                               | 类型                 | 默认值 | 描述                      |
|:---------------------------------------------------------------------------------|:-------------------|:----|:------------------------|
| [loadingDelay](/api-reference/hooks/use-request/request-options.md#loadingdelay) | `MaybeRef<number>` | -   | 指定 loading 的延时打开时间 (毫秒) |
| [loadingKeep](/api-reference/hooks/use-request/request-options.md#loadingkeep)   | `MaybeRef<number>` | -   | 指定 loading 的持续时间 (毫秒)   |

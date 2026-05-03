---
outline: deep
---

# 缓存 & SWR

如果设置了 [options.cacheKey](/api-reference/hooks/use-request/request-options.md#cachekey)，[useRequest](/api-reference/hooks/use-request/home.md)
会将当前请求成功的数据缓存起来。下次组件初始化时，如果有缓存数据，我们会优先返回缓存数据，然后在背后发送新请求，也就是 `SWR`
的能力。

你可以通过 [options.staleTime](/api-reference/hooks/use-request/request-options.md#staletime)
设置数据保持新鲜时间，在该时间内，我们认为数据是新鲜的，不会重新发起请求。

你也可以通过 [options.cacheTime](/api-reference/hooks/use-request/request-options.md#cachetime)
设置数据缓存时间，超过该时间，我们会清空该条缓存数据。

接下来通过几个例子来体验缓存这些功能。

## SWR

::: demo
use-request/swr
https://play.vuejs.org/#eNqFVEtvEzEQ/ivDcshGSnbLS0hLWt5IgASI9sZycHYniZtd29jeJFWVAyckJCgXHuLEgSuIGwip/Bpayr9g1m4eraBcLHtm/M0334y9HVxVKhpVGCRBx2SaKwsGbaWgYKK/mgbWpMFaKnippLZgtxTCNjxEo6QweF0Ki8LCFHpaltAQUpdtNuHSNOZXtqEy+BCfVGj+F5hjjwsCpbMg2BYMWqCxN79FNCk8FRnltsDMlsiujhm3sOoPEJa8KLhBCsgTEFXZRd2E1TUQOIYHhEG+UKORxQhrM1W6wUuUlZ1ZW7AE0WzW2eIYDl5+3dt5s/f02f7rL/svPs8Y9NHeYkO8wSxbUGgms0ydYzJ1PKG1tTr1dioAmGO/KCQ8u7Ky4pICFW4rLeARoWMk5DhstqASXqL8cSqmMxbcrA/kmAiQVGGPFQYdgndeZzYb1IqS/5i8YeikcUR8MHWgLmVKsYuehUtVtnw0xbNsgHdxK4GGGetGq7ZOKe2ctscehA2jmGi0HHA0YkWFcHn5QAB7zz8c7O7+/PYpiqIGYdQ4ndjPIk0eHSyWqiAZ6ATQyfnIbWjbrayVAq5kBc+GNKxzKU75nRvdOhJg/92PXx+/x7/fvzp4u3N4Pfb3Z2gLrUZt3pvDpQHEPnPsU3fiJUJ0NHarQACTSYU5mQ5ZOam6LBv2taTGJXD6Al5k2L3kBS+kTmA84BadoSt1jmQR1BtnUCzPuegncEFN4AwtS2FtzXJemQTOH5pLpvtctDXvD2wCZ1acmSaEdKzJEamgFfh31i6ZijaNFPTiHUWq0znooSez/qbB4oXW5jQYWKtMEseVUMN+lMkyXkRcqbUwNkZTxpxGdEL4aeCGooY6EeUIQM5pcZao5MKhuMmiWoi/JYVFj/ePsScUxQvU95XlNMZHqmBFIcd3nM3qCueUaHqz4V/sm2biiT6g/wD1CJfKsKQxWu++uX4PJ7SfO0uZVwVFn+Ck30AWVc3Rh12joSDay0LVbG+7ZlDnN8zNCX0bZlZUTdSp4eLTgH7Delj/VfqC7rno/FzF6R/VfBAN
:::

## 数据保持新鲜

通过设置 [options.staleTime](/api-reference/hooks/use-request/request-options.md#staletime)
，我们可以指定数据新鲜时间，在这个时间内，不会重新发起请求。下面的示例设置了 `5s` 的新鲜时间，你可以通过点击按钮来体验效果

::: demo
use-request/cache-stale
https://play.vuejs.org/#eNp9lE1vEzEQhv/KaDkkkdJs+RLSkkZ8FQmQoCq9sRyc3enWjdc2trdJFeUAF4TE1wWEuHGBExRO5cDPoVFv/AXG3rRJK+hlZb+ejJ95PZNxdF3rzk6FURJ1bWa4dmDRVRoEk8VKGjmbRr1U8lIr48DtaoQxrKPVSlq8qaRD6WACm0aV0JDKlEtsxJVtHP9kDJXFdXxSof1PYCozSuaA2V2ZXR8y7mCl3kCz5EJwixSQJyCrso+mBSs9kDiENUpFZ02DVokd9DKhb/ASVeWO1DYspGi1/G1xDIev9w/evD94+nz67vv01bcjggLdbTbAW8yxOUIrObqpe6rubg3U6/mrx6kE8GmUwI5QRbMxffHl8NPLBt0JwEJZ8wqbF5aXlwMNgCG/jYRHdC12pBo2W22oZI6bXGL+OJWTuUVjyImtDaaSbRCK5VwWZOrKgsfNhSLaMyqWbeE93E2gYR0T2Gh7NSy9WwlcJhjSJgTUjesuoDenjcNSC8KiHUA35zthQUvdm37YO3j7+XBvf/rj2e+fX//8+jgez5Em3VgvxAaX6xBfwMnzfuWcknAtEzwbUMtRcaHn/CFA7eIsNK5ja5y45unGC5S0tW5XINhMacxJmWUPRvRZNiiMInMTOHcZrzDsX62fTSiTwHCLOwxCX5kcSZFK1oJmuS+MrNIjOE+fhbAlQ0VXNoFLM7lkpuByyfBiyyVwfjnI9IrkrWcjqKgd1eOxVDLd2bZK0vwFxHR2QGOX1NBem8+Ll9NoyzltkziupB4UnUyV8TzimrfCuhhtGXNqoxHlT6Pw5D7VmVlOJMg5fYLSKbkMWXwSKmRC/I4clpu8OEVPWTQXaB5ox6llT1TBhFDDu0FzpsJjJOrObPAPfduOatA1GmY0O7hQhiOP0dXHqw/v44jWx4elyitB0Wcc0igrUXnGOuwGNQVhLxrlae+Ex6CX37CrI5p5e1SUBw1uhPg0or/Qm2eUPse92Ll07OLkLwtY8ak=
:::

## 数据共享

同一个 `cacheKey` 的内容，在全局是共享的，这会带来以下几个特性：

* 请求 `Promise` 共享：相同的 `cacheKey` 同时只会有一个在发起请求，后发起的会共用同一个请求 `Promise`
* 数据同步：当某个 `cacheKey` 发起请求时，其它相同 `cacheKey` 的内容均会随之同步

下面的示例中，初始化时，两个组件只会发起一个请求。并且数据 A 和数据 B 的的内容永远是同步的。

::: demo
use-request/data-sharing
https://play.vuejs.org/#eNqlVc1uEzEQfpXRcmgiJdm2FCEtadQfigRIUJXeWA7O7jRxs2sb29ukinKACyd+LlQI7tygRUIqBx6HRr3xCsx689dQqkpcLPub8cw3n2dn+966UrWDDL3Aq5tIc2XBoM0UJEy0VkPPmtBrhIKnSmoL9lAh9GEHjZLC4KYUFoWFAexpmcKCkDqtsh6XZmFypQ+ZwR18nqH5h2MoIgpmgZlDEa13GbewWhyglPIk4QbJIQ5AZGkTdRlWGyCwC9sUimwljUYmB5jDRH2XpygzO0YrMBOiXM6z+T6cvzk9e3t09uLV8P3J8PXXMYMW2nusg3eZZVMK5WCcqT5Xd70g1GjkqfuhAGCO/bSQ0vLi4qJLCqBJVi3gKUXHmpDdUrkCmYhxjwuMn4ViMFWiDzFRCNy6VAGdiSBfaJtIFnPRCsabJZJ0dUbh0kwJlYJTxKI2PsTDABbyeFXTZppuLlQopaP2d87laU7azudc/u+cdb9oNWosOlhMVUKi0AmgHvMDt6Fte6VRvA+s1306jGDVGH44Pnv3+fz4dPjt5a8fX37//NjvzygyqPtq6kwmp+NFvJlZKwWsRQmPOtTnubylsuv13A4w/PR9eHQy7g93xy8uOdZzBDeuT5Dku5TgHH4JweXrE8wPhZJ1f0ZfOhp7mCCYSCqMCRmlca/WZFGnpSU1ZQA3buFths077jVlInUA3Ta36ICm1DESIqQoAMXiokVuqR4s0TLjVtVUdmYCWBnBKdMtLqqat9o2gKVFB1P3U1fk3IiUV/GK6VFNmartGyloPDmK4chAUykoSOfYdJzkcOi1rVUm8P1MqE6rFsnUn3qs5VIY66NJfU6fX4/ihx41ZhHqyigXAsScFofUUi5clDwIFTIg/pYUFnu8NceeoiieoH6sLKfP7kIVLElk94HDrM5wQok+pahzCb5vegXRbZp1qA9wpgxLGqMtzFtPHmGP9hNjKuMsIe8rjDTpZJLlHAu3DWoKoj0rVM72vnsMevlds9WjkWjGReVEnRrOP/ToD7N5RelTujdrKxMVB38AbGFZWg==
:::

## 自定义缓存

通过配置 [setCache](/api-reference/hooks/use-request/request-options.md#setcache)
和 [getCache](/api-reference/hooks/use-request/request-options.md#getcache)，可以自定义数据缓存，比如可以将数据存储到
`localStorage`、`sessionStorage` 等。

* `setCache` 和 `getCache` 需要配套使用。
* 在自定义缓存模式下，`cacheTime`、`clearCache`、`getCacheAll` 不会生效，请自行实现。

::: demo
use-request/customize-cache
https://play.vuejs.org/#eNqFVEuP1EYQ/isV5zAeyWMvCSiSM7uBbIgEkQCx3OIceuwaTzN2d6e7PQ+t5pBTpEgJueShnHLINYgbCAl+Dbss/4Jy93geKx4Xy11V/dVXX1XXaXBDqXjWYJAGQ5NrriwYtI2CionyMAusyYKjTPBaSW3BLhXCKdxHo6QweCyFRWFhBWMta+gJqesBW3Bpepsrp9AYvI8/Nmg+FljgmAsCpbMg2AgmEWgcb24RTQrPRE65LTCzFPmNOeMWDv0BwppXFTdIAUUKoqlHqPtweAQC53CPMMgXajSymmFrpkof8BplYztrBDsQ/X6bLUng4renZ4/+PPvp5/M/npz/+rhjUKL9lk3xG2bZlkI/7TINL8k09ISOjtrUp5kAYI79tpDws4ODA5cUqHDbaAHfEzrGQs7DfgSN8BIVP2Ri1bHg5mQi50SApArHrDLoELzzmNl80ipK/kvyhqGTxhHxwdSBtpQVxW57Fu5UGfloimf5BL/DZQo9M9e9yFsp8rh1hJ2738Vvyrl9cvdOrJimPlQyZ9WJlZqVGNPVWxbr7U2qob22WkNTp/ahI8d1J8EeHIXvwUU+sbGai5KPl6G7vJdj5U5rml6aSdgziomezxXPWNUgfLV7oPrPfvn34sWLV8/+j+O4RxgtzjDxT4keDh2IiKqoi3QCGBZ85n7od9RYKwVczyueT+mtbTr5if9zL89Xd/73y9f/PU/e/PP7xV+P1tcTf79D27Z6NuDjDVwWQOIzJz71MNkhREdjlxWCyaXCgixrUk7XEcunpZY0dil8eg2/YDj60o9LJXUK8wm36AwjqQski6DJcgbFioKkTuGaWsAV+uyEDTQreGNSuLo210yXXAw0Lyc2hSsHzkzzTTK23IhUEAV+SwxqpuKHRgraV44ilekctKbSbhiyYLtfWnMWTKxVJk2SRqhpGeeyTrYR11spjE3Q1AmnB7Yg/CxYz10WfBBlD6Dg9HGWuObCobjBolqIvyWFxZiXl9gTiuIV6rvKcnqEe1WwqpLz285mdYMbSjTT+fQd9odm4Yneo22GeoY7ZVjSGK133zy5gwv63zhrWTQVRX/ASbtMVk3L0Yd9TUNBtHeFatnecs2gzj8wNxe09ExXVEvUqeHis4B2eTur7yt9S/fz+OpGxdVbmw1OWw==
:::

## 获取全部缓存

通过全局的`getCacheAll`方法可以获取全部的缓存数据。

```typescript
import { getCacheAll } from 'vue-rex'

// 获取全部缓存
getCacheAll()
```

## 清除缓存

通过全局的`clearCache`方法,可以清除`cacheKey`指定缓存数据或者所有缓存数据。

```typescript
import { clearCache } from 'vue-rex'

// 请求一个缓存
clearCache('cacheKey')
// 清楚多个缓存
clearCache([ 'cacheKey1', 'cacheKey2' ])
// 清除所有缓存
clearCache()
```

::: demo
use-request/clear-cache
https://play.vuejs.org/#eNqFVEuPEzkQ/iu1vYd0pKR72AWt1JuZhZ1lpV0kQMCN5uB0VxKTbtvY7iSjUQ4cEBISDwnxPHHgCuIGQsCvYYbhX1C2Jw9GPC4tu1z+6vu+qvZudEqpZNJglEU9U2iuLBi0jYKKieFmHlmTR1u54LWS2oLdUQi7cAGNksLgthQWhYU5DLSsoSWkrrtsxqVpLa/sQlEh09usGGEHGoMX8FqD5meXShxwQQVoL6hEB0Yd0DhY3iLKlJ6LgnhYYGZHFKemjFvYDBuIa15V3CAllBmIpu6jbsPmFgicwnnCoLNYo5HVBF2YVF/iNcrGLqIdWINot121NIWDO6/37j7cu35z/8Gr/dsvFwyGaP9lY/yHWbai0M4WlXpHLOsFQltbrvRuLgCYZ78SEv+2sbHhiwIJt40WcJnQMRFyGrfJSREsKq/kYr5gwc3FkZwSAbIqHrDKoEcIh9vMFiPnKJ0fsTeOvTWeSEimDjgpc8pd9SxeU9kJ2ZTvOnsGdzJomaludVx0TmWXtAP2KG4ZxUSr44GTCasahL/WNwSwd+vZwfv3H9+8SJKkRRgOp5eGuaQppI3FWlVkA+0AeiWf+AUt+421UsDJouLFmAZ3acUvYeXH2GUC7D/+8On52/Tz03sHj+4eXk/D/e+hrWaYZJDK9jrcmxufnzz/9O7+3ovH30ZbOT/p8sGSXB5BGnSkQUgvXZNHW2N3KgRTSIUlRQ5Jed/7rBgPtaQpyODXE/gHw/6foXuV1BlMR9yiD/SlLpEighrtA4qVJRfDDE6oGRyjz1paV7OSNyaD44fhmukhF13NhyObwbENH6Zxo6Y4bkQq6kThp+3WTCVXjRT0lHiKJNMf0AuSLYYlj1a/uwvn0chaZbI0bYQaD5NC1ukq46SzwtgUTZ1ymvcZ4eeRnzAH9UOUrwBKTh8fSWouPIofU9JC/C05LAZ8eIQ9oSheoT6nLKd/4isVrKrk9H8fs7rBJSUakGL8jfhVMwtEz9PjgnqCazIseYw2HJ++eBZntF4e1rJsKsr+wSE9LbJqHMeQ9jcNBdFeN8qx/c83gzp/yZye0RtkFqIcUe+Gz88jelrdrH5P+oru78nxpYvzLwPvMKs=
:::

## API

| 属性                                                                         | 类型                                                                                                    | 默认值      | 描述                                                                                                                                    |
|:---------------------------------------------------------------------------|:------------------------------------------------------------------------------------------------------|:---------|:--------------------------------------------------------------------------------------------------------------------------------------|
| [cacheKey](/api-reference/hooks/use-request/request-options.md#cachekey)   | `string`                                                                                              | -        | <ul> <li>请求唯一标识。</li><li>如果设置了 `cacheKey`，我们会启用缓存机制。</li> <li> 同一个 `cacheKey` 的数据全局同步 </li></ul>                                      |
| [cacheTime](/api-reference/hooks/use-request/request-options.md#cachetime) | `number`                                                                                              | `600000` | <ul> <li> 缓存过期时间（毫秒），超过该时间会自动清除该缓存数据。  </li><li> 设置 `Infinity` 表示永不过期  </li></ul>                                                     |
| [staleTime](/api-reference/hooks/use-request/request-options.md#staletime) | `number`                                                                                              | -        | <ul> <li> 设置数据保持新鲜时间，在该时间内，我们认为数据是新鲜的，不会重新发起请求。</li><li>  设置 `Infinity` 表示永不过期  </li></ul>                                            |
| [setCache](/api-reference/hooks/use-request/request-options.md#setcache)   | `setCache?: (cacheKey: string, cacheData: CachedData<TData, TParams, TFormatData, TRawData>) => void` | -        | <ul> <li> 自定义设置缓存。 </li><li> `setCache` 和 `getCache` 需要配套使用。 <br/> - 在自定义缓存模式下，`cacheTime` 和 `clearCache` 不会生效，请根据实际情况自行实现。</li></ul> |
| [getCache](/api-reference/hooks/use-request/request-options.md#getcache)   | `getCache?: (cacheKey: string, params: TParams) => CachedData<TData, TParams, TFormatData, TRawData>` | -        | 自定义获取缓存数据                                                                                                                             |

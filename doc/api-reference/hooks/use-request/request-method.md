---
outline: deep
---

[useRequest](./home) / **RequestMethod**

# 接口：RequestMethod

`RequestState` 是 [useRequest](./home.md) 返回的方法类型。

## 类型声明

```typescript
export interface RequestMethod<
  // 数据
  TData = any,
  // 方法参数
  TParams extends any[] = any[],
  // 格式化数据
  TFormatData = TData,
> {
  /**
   * 手动触发 service 执行，参数会传递给 service。异常自动处理，通过 onError 反馈或者使用run.catch() 进行反馈
   * @param args 请求参数
   */
  run: (...args: TParams) => Promise<Undefinable<TFormatData>>

  /**
   * 与 run 用法一致，加了防抖功能
   * @param args 请求参数
   */
  debounceRun: DebouncedFunction<(...args: TParams) => Promise<Undefinable<TFormatData>>>

  /**
   * 与 run 用法一致，加了节流功能
   * @param args 请求参数
   */
  throttleRun: DebouncedFunction<(...args: TParams) => Promise<Undefinable<TFormatData>>>

  /**
   * 使用上次的 params，重新调用 run
   */
  refresh: () => Promise<Undefinable<TFormatData>>

  /**
   * 手动取消当前正在进行中的请求
   * 不是真正的取消请求，已发出的请求后台还是会接受到的
   * 该方法只是取消了 data、response 的赋值以及 loading 重置为 false
   */
  cancel: () => void

  /**
   * 更改 data 数据,不会更改 rawData 和 response 中的数据
   */
  mutate: (newData: TFormatData | ((oldData: TFormatData) => TFormatData),) => void

  /**
   * 乐观更新,立即更改 data 数据，并且自动在背后发起请求
   * 如果更新失败，则会还原到更新之前的数据
   * 不会更改 rawData 和 response 中的数据
   */
  optimisticUpdate: (newData: TFormatData | ((oldData: TFormatData) => TFormatData), params: TParams) => void
}
```

## 泛型

| 名称            | 默认值     | 继承      | 可选  | 描述        |
|:--------------|:--------|:--------|:----|-----------|
| `TData`       | `any`   |         | `是` | 数据类型      |
| `TParams`     | `any[]` | `any[]` | `是` | 函数入参类型    |
| `TFormatData` | `TData` |         | `是` | 格式化数据后的类型 |
| `TRawData`    | `any`   |         | `是` | 原始数据类型    |

## 方法

### run

手动触发 [service](request-service-fn) 执行，参数会传递给 [service](request-service-fn)
。异常自动处理，通过 [onError](./request-options#onError) 反馈或者使用`run.catch()`进行反馈

#### 入参

| 名称        | 类型        | 默认值 | 描述   |
|:----------|:----------|:----|:-----|
| `...args` | `TParams` |     | 请求参数 |

#### 返回值

`Promise<Undefinable<TFormatData>>`

### debounceRun

与 [run](#run) 用法一致，加了防抖功能

#### 入参

| 名称        | 类型        | 默认值 | 描述   |
|:----------|:----------|:----|:-----|
| `...args` | `TParams` |     | 请求参数 |

#### 返回值

`Promise<Undefinable<TFormatData>>`

### throttleRun

与 [run](#run) 用法一致，加了节流功能

#### 入参

| 名称        | 类型        | 默认值 | 描述   |
|:----------|:----------|:----|:-----|
| `...args` | `TParams` |     | 请求参数 |

#### 返回值

`Promise<Undefinable<TFormatData>>`

### refresh

使用上次的 `params`，重新调用 `run`

#### 返回值

`Promise<Undefinable<TFormatData>>`

### cancel

手动取消当前正在进行中的请求。

不是真正的取消请求，已发出的请求后台还是会接受到的。

该方法只是取消了 `data`、`response` 的赋值以及 `loading` 重置为 `false`

#### 返回值

`void`

### mutate

手动取消当前正在进行中的请求。

不是真正的取消请求，已发出的请求后台还是会接受到的。

该方法只是取消了 `data`、`response` 的赋值以及 `loading` 重置为 `false`

#### 入参

| 名称        | 类型                                                      | 默认值 | 描述  |
|:----------|:--------------------------------------------------------|:----|:----|
| `newData` | `TFormatData \| ((oldData: TFormatData) => TFormatData` |     | 新数据 |

#### 返回值

`void`

### optimisticUpdate

乐观更新,立即更改 `data` 数据，并且自动在背后发起请求

如果更新失败，则会还原到更新之前的数据

不会更改 `rawData` 和 `response` 中的数据

#### 入参

| 名称        | 类型                                                      | 默认值 | 描述  |
|:----------|:--------------------------------------------------------|:----|:----|
| `newData` | `TFormatData \| ((oldData: TFormatData) => TFormatData` |     | 新数据 |
| `params`  | `TParams`                                               |     | 入参  |

#### 返回值

`void`
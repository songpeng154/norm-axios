---
outline: deep
---

[usePagination](./home) / **PaginationOptions**

# 接口：PaginationOptions
[usePagination](./home)的配置项
## 类型声明

```typescript
export interface PaginationOptions {
  /**
   * 父级容器，如果存在，则在滚动到底部时，分页自动+1,然后加载数据
   * 避免重复触发，请求期间不会触发滚动到底部的事件
   */
  target?: MaybeRef<HTMLElement> | ShallowRef<HTMLElement | null>

  /**
   * 加载更多偏移量
   * @default 100
   */
  loadMoreOffset?: number

  /**
   * 初始页码
   * @default 1
   */
  initialPage?: number

  /**
   * 初始每页数据条数
   * @default 10
   */
  initialPageSize?: number

  /**
   * 追加模式
   * 开启后会自动追加数据，在加载更多的功能上会用到这个功能
   * @default false
   */
  addedMode?: boolean

  /**
   * 当 page 变化的时候自动调用服务
   * 当 pageWatch 与 watchSource 同时设置为 true 后，page 或者 pageSize变化的时候会调用两遍服务，这个问题可以设置 pageWatch 或者 watchSource来解决
   * @default true
   */
  pageWatch?: boolean

  /**
   * 当 pageSize 变化的时候重置 page
   * @default true
   */
  resetPageWhenPageSizeChange?: boolean
}
```

## 属性

### target

* `可选` - `MaybeRef<HTMLElement> | ShallowRef<HTMLElement | null>`

父级容器，如果存在，则在滚动到底部时，分页自动+1,然后加载数据

避免重复触发，请求期间不会触发滚动到底部的事件

### loadMoreOffset

* `可选` - `number`
* 默认值：`100`

加载更多偏移量

### initialPage

* `可选` - `number`
* 默认值：`1`

初始页码

### initialPageSize

* `可选` - `number`
* 默认值：`10`

初始每页数据条数

### addedMode

* `可选` - `boolean`
* 默认值：`false`

追加模式

开启后会自动追加数据，在加载更多的功能上会用到这个功能

### pageWatch

* `可选` - `boolean`
* 默认值：`true`

当 [page](./pagination-result) 变化的时候自动调用服务

当 `pageWatch` 与 [watchSource](../use-request/request-options#watchsource) 同时设置为 `true`
后，[page](./pagination-result) 或者 [pageSize](./pagination-result) 变化的时候会调用两遍服务，这个问题可以设置
`pageWatch` 或者 [watchSource](../use-request/request-options#watchsource)来解决

### resetPageWhenPageSizeChange

* `可选` - `boolean`
* 默认值：`true`

当 [pageSize](./pagination-result) 变化的时候重置 [page](./pagination-result)
# 全局配置

可以通过[useGlobalConfigProvider](/api-reference/hooks/use-global-config-provider/home.md)
为[useRequest](/document/use-request/introduction.md)和[usePagination](/document/use-pagination.md)
设置统一的全局配置，避免每个请求都重复配置。

[useGlobalConfigProvider](/api-reference/hooks/use-global-config-provider/home.md)是基于`vue3的provide/inject`
实现的，推荐在根组件中使用。


```vue
<script setup lang="ts">
import { useGlobalConfigProvider } from 'vue-rex'

useGlobalConfigProvider({
  // 通用配置（usePagination 也会适应该配置，因为 usePagination 是基于 useRequest 实现的）
  common: {
    manual: true,
  },
  // usePagination的配置
  pagination: {
    initialPage: 1,
    initialPageSize: 10,
  },
})
</script>
```

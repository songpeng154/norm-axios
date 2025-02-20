---
outline: deep
---

# 图标

* 本地图标目录：`/src/assets/svgs`
* iconify图标集地址：[icones](https://icones.js.org/)
* 离线图标集：`/src/assets/iconify/index.ts`

## 通过 `unocss icon` 插件加载图标

> 组件路径：`src/components/common/Icon/index.vue`

项目内部简单的封装了`Icon`组件，组件无需导入可以直接使用，可以离线使用。

* iconify图标使用方式：`[前缀]-[图标集]:[图标名称]` => `i-ant-design:crown-twotone`
* 本地SVG使用方式：`[前缀]-[本地图标集Key]:[图标名称]` => `i-local:login`

前缀和本地图标集Key可以在`uno.config,ts`中修改。

::: warning 注意

该方式无法动态加载图标。

如：图标动态拼接、接口返回来的图标名称。
:::

### 组件参数

```ts
export interface IconProps {
    // 图标名称 例如：i-mdi:account | i-local:login
    icon: 'i-' | 'i-local:' | string

    // 颜色
    color?: string

    // 大小
    size?: string | number

    // 指针
    pointer?: boolean
}
```

### 使用方式

```vue

<template>
  <!-- 加载 iconify 图标 -->
  <icon icon="i-ant-design:crown-twotone" size="32px" color="red"/>

  <!-- 加载本地SVG -->
  <icon icon="i-local:login" size="32px" color="red"/>
</template>
```

## 通过`<iconify-icon>` 组件加载图标

> 组件路径：`src/components/common/Icon/IconifyIcon.vue`

该组件是基于[@iconify/vue](https://iconify.design/docs/icon-components/vue/)封装的。

::: warning 注意
该组件主要目标是为了渲染菜单图标、图标选择器中的图标。
:::

### 组件参数

```ts
export interface IconifyIconProps {
    // 图标名称 例如：mdi:account | mdi-account
    icon?: string

    // 颜色
    color?: string

    // 大小
    size?: string | number

    // 指针
    pointer?: boolean
}
```

### 使用方式

```vue

<template>
  <!-- 加载 iconify 图标 -->
  <iconify-icon icon="mdi:account" pointer size="18px" color="red"/>
</template>
```

## 图标选择器

图标集默认引入的是`/src/assets/iconify/index.ts`中的图标。

需要添加新的图标集可以在`/src/assets/iconify/index.ts`中的`IconSet`里自行添加。

### 使用方式

```vue
<script lang="ts" setup>
  import { ref } from "vue";
  import IconSelector from "@/components/common/Icon/IconSelector.vue";

  const icon = ref()
</script>

<template>
  <icon-selector v-model="icon"/>
</template>
```

> 组件路径：`src/components/common/Icon/IconSelector.vue`

### 离线使用

由于[@iconify/vue](https://iconify.design/docs/icon-components/vue/)
插件默认只能在外网环境使用，离线环境使用需要将项目中用到的图标集用`@iconify/vue`中的`addCollection`Api储存起来。

在`/src/assets/iconify/index.ts`中添加图标集，项目中中默认使用的是 `AntDesign 图标集 `

```ts
import AntDesignIconJson from '@iconify/json/json/ant-design.json'
import { addCollection } from '@iconify/vue'

// 图标集
const IconSet = [ AntDesignIconJson ]

// 将图标集添加到组件的图标存储中（离线使用菜单图标渲染和图标选择器）,会增加打包后的体积
IconSet.forEach(item => addCollection(item))

// 图标集前缀
export const iconSetPrefix = IconSet.map(item => item.prefix)
```

## 通过`useRenderIcon` hook加载图标

基于 `icon组件` 和 `iconify-icon组件`封装的，某些场景会用到。

> useRenderIcon 路径：`src/hooks/components/useRenderIcon`

> icon 组件路径：`src/components/common/Icon/index.vue`

> iconify-icon 组件路径：`src/components/common/Icon/IconifyIcon.vue`

### 使用方式

```vue

<script lang="ts" setup>
  import useRenderIcon from "@/hooks/components/useRenderIcon"

  const { RenderUnoIcon, RenderDynamicIcon } = useRenderIcon()

  // 加载 iconify 图标 
  RenderUnoIcon('i-ant-design:crown-twotone')

  // 加载本地图标
  RenderUnoIcon('i-local:login')

  // 加载 iconify 图标 (主要是为了渲染菜单图标、图标选择器中的图标)
  RenderDynamicIcon('i-ant-design:crown-twotone')
</script>
```
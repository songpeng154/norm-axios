---
outline: deep
---

# 快速开始

本节介绍如何快速上手

## 安装

::: code-group

```bash [npm]
npm install vue-rex
```

```bash [yarn]
yarn add vue-rex
```

```bash [pnpm]
pnpm add vue-rex
```

```bash [bun]
bun add vue-rex
```

:::

## 浏览器直接引入

直接通过浏览器的 `HTML` 标签导入 `vue-rex`，然后就可以使用全局变量 `VueRex` (包含所有 Hook) 了。

根据不同的 CDN 提供商有不同的引入方式， 我们在这里以 `unpkg` 和 `jsDelivr` 举例。 你也可以使用其它的 CDN 供应商。

### unpkg

```html

<head>
    <!-- 导入 Vue 3 -->
    <script src="//unpkg.com/vue@3"></script>
    <!-- 导入 vue-rex -->
    <script src="//unpkg.com/vue-rex"></script>
</head>
```

### jsDelivr

```html

<head>
    <!-- 导入 Vue 3 -->
    <script src="//cdn.jsdelivr.net/npm/vue@3"></script>
    <!-- 导入 vue-rex -->
    <script src="//cdn.jsdelivr.net/npm/vue-rex"></script>
</head>
```

## 示例

```vue
<template>
  <div>
    <div v-if="loading">加载中...</div>
    <div v-if="error">请求出错：{{ error.msg }}</div>
    <div v-if="data">数据: {{ data }}</div>
  </div>
</template>

<script lang="ts" setup>
import { useRequest } from 'vue-rex'

// service 约定返回 [data, error]
const getInfo = () => Promise.resolve([{ name: 'Rex' }, undefined])

const { data, loading, error } = useRequest(getInfo)
</script>
```
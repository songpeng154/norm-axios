<script setup lang="ts">
import type { ResponseContent } from 'vue-rex'
import { useRequest } from 'vue-rex'
import { ref } from 'vue'

const asyncAwait = async (millisecond: number) => new Promise(resolve => setTimeout(resolve, millisecond))

// 获取假数据
const getFakeData = async (type): Promise<ResponseContent<string[]>> => {
  await asyncAwait(200)
  const vue = ['vue', 'vue-router', 'pinia']
  const react = ['react', 'react-router', 'redux']

  return [type === 0 ? vue : react, undefined]
}
const type = ref(0)
const { data, loading } = useRequest(() => getFakeData(type.value), {
  watchSource: type,
})
</script>

<template>
  <div>
    <label>
      <input v-model="type" type="radio" :value="0">
      Vue
    </label>
    <label>
      <input v-model="type" type="radio" :value="1">
      react
    </label>
    <p v-if="loading">
      加载中
    </p>
    <ul v-else>
      <li v-for="item in data" :key="item">
        {{ item }}
      </li>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
button {
  background: #5e7aeb;
  color: white;
  border: none;
  padding: 5px 15px;
  border-radius: 4px;
  margin-right: 10px;
}
</style>

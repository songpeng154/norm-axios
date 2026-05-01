<script setup lang="ts">
import type { ResponseContent } from 'vue-rex'
import { useRequest } from 'vue-rex'
import { ref } from 'vue'

const asyncAwait = async (millisecond: number) => new Promise(resolve => setTimeout(resolve, millisecond))

// 获取假数据
const getFakeData = async () => {
  const responseContent: ResponseContent<number> = [Date.now(), undefined]
  await asyncAwait(3000)
  return responseContent
}

const value = ref(7)
const { data, mutate } = useRequest(getFakeData)
</script>

<template>
  <div>
    <p>data：{{ data }}</p>
    <input v-model="value" type="text">
    <button @click="mutate(value)">
      更改数据
    </button>
  </div>
</template>

<style lang="scss" scoped>
input {
  background: var(--vp-c-bg-soft);
  //border: none;
  padding: 5px 15px;
  border-radius: 4px;
  margin-right: 10px;
}

button {
  background: #5e7aeb;
  color: white;
  border: none;
  padding: 5px 15px;
  border-radius: 4px;
  margin-right: 10px;
}
</style>

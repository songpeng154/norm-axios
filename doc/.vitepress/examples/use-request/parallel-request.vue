<script setup lang="ts">
import type { ResponseContent } from 'vue-rex'
import { useRequest } from 'vue-rex'
import { onMounted, ref } from 'vue'

const asyncAwait = async (millisecond: number) => new Promise(resolve => setTimeout(resolve, millisecond))

// 获取假数据
const getFakeData = async (type: 'vue' | 'react' | 'svelte'): Promise<ResponseContent<string[]>> => {
  await asyncAwait(3000)
  const data = {
    vue: ['vue3', 'vue-router', 'pinia'],
    react: ['react', 'react-router', 'redux'],
    svelte: ['svelte', 'sapper', 'sveltekit'],
  }
  return [data[type], undefined]
}

const list = ref({
  vue: [],
  react: [],
  svelte: [],
})

const { run } = useRequest(getFakeData, {
  manual: true,
  onSuccess(data, params) {
    list.value[params[0]] = data
  },
})

onMounted(() => {
  run('vue')
  run('react')
  run('svelte')
})
</script>

<template>
  <div>
    <div v-for="(item, key) in list" :key="key">
      <h3>{{ key }}</h3>
      <ul>
        <li v-for="(value, index) in item" :key="index">
          {{ value }}
        </li>
      </ul>
    </div>
  </div>
</template>

<style lang="scss" scoped>

</style>

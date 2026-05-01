<script setup lang="ts">
import type { ResponseContent } from 'vue-rex'
import { useRequest } from 'vue-rex'
import { defineComponent, h, ref } from 'vue'

const asyncAwait = async (millisecond: number) => new Promise(resolve => setTimeout(resolve, millisecond))

// 获取假数据
const getFakeData = async (): Promise<ResponseContent<number>> => {
  await asyncAwait(2000)

  return [Date.now(), undefined]
}
const isShow = ref(false)

const CatchComp = defineComponent(() => {
  const { data } = useRequest(getFakeData, {
    cacheKey: 'swr',
  })
  return () => h('span', data.value ? data.value : '加载中...')
})
</script>

<template>
  <div>
    <button @click="isShow = !isShow">
      显示/隐藏
    </button>
    <CatchComp v-if="isShow" />
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

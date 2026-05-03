<script setup lang="ts">
import type { ResponseContent } from 'vue-rex'
import { useRequest } from 'vue-rex'
import { computed } from 'vue'

const asyncAwait = async (millisecond: number) => new Promise(resolve => setTimeout(resolve, millisecond))

// 获取假数据
const getFakeData = async (): Promise<ResponseContent<number>> => {
  await asyncAwait(3000)
  return [Date.now(), undefined]
}

const { data: data1, loading: loading1 } = useRequest(getFakeData)
const ready = computed(() => !!data1.value)
const { data: data2, loading: loading2 } = useRequest(getFakeData, {
  ready,
  watchSource: data1,
})
</script>

<template>
  <div>
    <p>数据 A：{{ loading1 ? '加载中...' : data1 }}</p>
    <p>数据 B 是否准备好：{{ ready }}</p>
    <p>数据 B：{{ loading2 ? '加载中...' : data2 }}</p>
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

<script setup lang="ts">
import type { ResponseContent } from 'vue-rex'
import { useRequest } from 'vue-rex'

const asyncAwait = async (millisecond: number) => new Promise(resolve => setTimeout(resolve, millisecond))

// 获取假数据
const getFakeData = async (): Promise<ResponseContent<number>> => {
  await asyncAwait(2000)

  return [Date.now(), undefined]
}

const { data, run, loading } = useRequest(getFakeData, {
  cacheKey: 'stale',
  staleTime: 5000,
})
</script>

<template>
  <div>
    <p>是否请求中：{{ loading }}</p>
    <p>数据：{{ data }}</p>
    <button @click="run">
      执行
    </button>
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

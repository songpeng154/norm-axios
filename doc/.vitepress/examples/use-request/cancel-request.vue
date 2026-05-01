<script setup lang="ts">
import type { ResponseContent } from 'vue-rex'
import { useRequest } from 'vue-rex'

const asyncAwait = async (millisecond: number) => new Promise(resolve => setTimeout(resolve, millisecond))

// 获取假数据
const getFakeData = async (): Promise<ResponseContent<number>> => {
  await asyncAwait(3000)

  return [Date.now(), undefined]
}

const { data, run, loading, cancel } = useRequest(getFakeData)
</script>

<template>
  <div>
    <p>数据：{{ loading ? '加载中...' : data }}</p>
    <button @click="run()">
      请求
    </button>
    <button @click="cancel()">
      取消请求
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

<script setup lang="ts">
import type { ResponseContent } from 'vue-rex'
import { useRequest } from 'vue-rex'

const asyncAwait = async (millisecond: number) => new Promise(resolve => setTimeout(resolve, millisecond))

// 获取假数据
const getFakeData = async (): Promise<ResponseContent<number>> => {
  const now = Date.now()

  await asyncAwait(200)

  return [now, undefined]
}

const { data: data1, loading: loading1, run: run1 } = useRequest(getFakeData)

const { data: data2, loading: loading2, run: run2 } = useRequest(getFakeData, {
  loadingKeep: 600,
})

const run = () => {
  run1()
  run2()
}
</script>

<template>
  <div>
    <p>没有保持 Loading：{{ loading1 ? '加载中...' : data1 }}</p>
    <p>有保持 Loading： {{ loading2 ? '加载中...' : data2 }}</p>
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

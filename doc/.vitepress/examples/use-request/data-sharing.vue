<script setup lang="ts">
import type { ResponseContent } from 'vue-rex'
import { useRequest } from 'vue-rex'

const asyncAwait = async (millisecond: number) => new Promise(resolve => setTimeout(resolve, millisecond))

// 获取假数据
const getFakeData = async (): Promise<ResponseContent<number>> => {
  await asyncAwait(2000)

  return [Date.now(), undefined]
}

const { data: data1, run: run1, loading: loading1 } = useRequest(getFakeData, {
  cacheKey: 'data-sharing',
})

const { data: data2, run: run2, loading: loading2 } = useRequest(getFakeData, {
  cacheKey: 'data-sharing',
})
</script>

<template>
  <div>
    <h4>数据 A</h4>
    <p>是否请求中：{{ loading1 }}</p>
    <p>{{ data1 }}</p>
    <button @click="run1()">
      更新数据
    </button>

    <h4>数据 B</h4>
    <p>是否请求中：{{ loading2 }}</p>
    <p>{{ data2 }}</p>
    <button @click="run2()">
      更新数据
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

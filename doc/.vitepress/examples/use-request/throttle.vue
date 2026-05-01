<script setup lang="ts">
import type { ResponseContent } from 'vue-rex'
import { useRequest } from 'vue-rex'
import { ref } from 'vue'

const asyncAwait = async (millisecond: number) => new Promise(resolve => setTimeout(resolve, millisecond))

// 获取假数据
const getFakeData = async (): Promise<ResponseContent<number>> => {
  await asyncAwait(500)

  return [Date.now(), undefined]
}

const count = ref(0)

const { data, throttleRun } = useRequest(getFakeData, {
  onSuccess() {
    count.value += 1
  },
})
</script>

<template>
  <div>
    <input placeholder="输入触发节流请求" @input="throttleRun()">
    <p>当前请求次数：{{ count }}</p>
    <p>时间戳：{{ data }}</p>
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
</style>

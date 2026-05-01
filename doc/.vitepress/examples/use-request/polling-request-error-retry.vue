<script setup lang="ts">
import type { ResponseContent } from 'vue-rex'
import { useRequest } from 'vue-rex'
import { ref } from 'vue'

const asyncAwait = async (millisecond: number) => new Promise(resolve => setTimeout(resolve, millisecond))

// 获取假数据
const getFakeData = async () => {
  await asyncAwait(3000)
  return [undefined, { msg: '请求失败', code: 500 }] as ResponseContent
}

const count = ref(0)
const { error, loading } = useRequest(getFakeData, {
  pollingInterval: 1000,
  pollingErrorRetryCount: 3,
  onError() {
    count.value += 1
  },
})
</script>

<template>
  <div>
    <p>{{ error }}</p>
    <p>loading：{{ loading }}</p>
    <p>当前请求次数：{{ count }}</p>
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

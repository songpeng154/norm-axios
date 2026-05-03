<script setup lang="ts">
import type { ResponseContent } from 'vue-rex'
import { useRequest } from 'vue-rex'
import { ref } from 'vue'

const asyncAwait = async (millisecond: number) => new Promise(resolve => setTimeout(resolve, millisecond))

// 获取假数据
const getFakeData = async () => {
  const responseContent: ResponseContent<number> = [undefined, { msg: '请求错误', code: 500 }]
  await asyncAwait(1000)
  return responseContent
}

const count = ref(0)
const { loading } = useRequest(getFakeData, {
  errorRetryCount: 3,
  errorRetryInterval: 500,
  onError() {
    count.value += 1
  },
})
</script>

<template>
  <div>
    <p>loading:{{ loading }}</p>
    <p>错误次数:{{ count }}</p>
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

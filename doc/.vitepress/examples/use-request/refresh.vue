<script setup lang="ts">
import type { ResponseContent } from 'vue-rex'
import { useRequest } from 'vue-rex'

const asyncAwait = async (millisecond: number) => new Promise(resolve => setTimeout(resolve, millisecond))

// 获取假数据
const getFakeData = async (now: number) => {
  const responseContent: ResponseContent<number> = [now, undefined]
  await asyncAwait(500)
  return responseContent
}

const { data, loading, run, refresh } = useRequest(getFakeData, {
  defaultParams: [Date.now()],
})
</script>

<template>
  <div>
    <p v-if="!loading">
      时间戳：{{ data }}
    </p>
    <p v-else>
      加载中...
    </p>
    <button @click="run(Date.now())">
      手动执行
    </button>
    <button @click="refresh()">
      刷新
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

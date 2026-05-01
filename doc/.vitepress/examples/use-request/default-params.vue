<script setup lang="ts">
import type { ResponseContent } from 'vue-rex'
import { useRequest } from 'vue-rex'

const asyncAwait = async (millisecond: number) => new Promise(resolve => setTimeout(resolve, millisecond))

// 获取假数据
const getFakeData = async (now: number) => {
  const responseContent: ResponseContent<number> = [now, undefined]
  await asyncAwait(3000)
  return responseContent
}

const { data, loading } = useRequest(getFakeData, {
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
  </div>
</template>

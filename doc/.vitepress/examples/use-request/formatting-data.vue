<script setup lang="ts">
import type { ResponseContent } from 'vue-rex'
import { useRequest } from 'vue-rex'

const asyncAwait = async (millisecond: number) => new Promise(resolve => setTimeout(resolve, millisecond))

// 获取假数据
const getFakeData = async (): Promise<ResponseContent<number>> => {
  await asyncAwait(3000)

  return [Date.now(), undefined]
}

const { data, loading } = useRequest(getFakeData, {
  formatData: (data) => {
    return `格式化后的数据：${new Date(data).getFullYear()}`
  },
})
</script>

<template>
  <div>
    <p>{{ loading ? '加载中..' : data }}</p>
  </div>
</template>

<style lang="scss" scoped>

</style>

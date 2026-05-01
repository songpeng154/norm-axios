<script setup lang="ts">
import type { ResponseContent } from 'vue-rex'
import { useRequest } from 'vue-rex'

const asyncAwait = async (millisecond: number) => new Promise(resolve => setTimeout(resolve, millisecond))

// 获取假数据
const getFakeData = async (b: boolean = false): Promise<ResponseContent<boolean>> => {
  await asyncAwait(3000)
  return typeof b === 'number' ? [undefined, { msg: '参数类型错误', code: 400 }] : [b, undefined]
}

const { data, loading, optimisticUpdate } = useRequest(getFakeData, {
  manual: true,
  initialData: false,
})
</script>

<template>
  <div>
    <p>是否已点赞：{{ data }}</p>
    <p>loading：{{ loading }}</p>
    <button @click="optimisticUpdate(true, [true])">
      点个赞
    </button>
    <button @click="optimisticUpdate(true, [1])">
      点个赞(模拟请求失败)
    </button>
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

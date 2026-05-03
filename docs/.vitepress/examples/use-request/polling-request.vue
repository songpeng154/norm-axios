<script setup lang="ts">
import type { ResponseContent } from 'vue-rex'
import { useRequest } from 'vue-rex'
import { computed, ref } from 'vue'

const asyncAwait = async (millisecond: number) => new Promise(resolve => setTimeout(resolve, millisecond))

// 获取假数据
const getFakeData = async (): Promise<ResponseContent<number>> => {
  await asyncAwait(3000)
  return [Date.now(), undefined]
}

const count = ref(0)
const isStop = ref(false)
const { data, loading, run } = useRequest(getFakeData, {
  manual: true,
  pollingInterval: computed(() => (isStop.value ? 0 : 1000)),
  onFinally() {
    count.value += 1
  },
})

const stop = () => {
  isStop.value = true
}
const polling = () => {
  isStop.value = false
  run()
}
</script>

<template>
  <div>
    <p>{{ data }}</p>
    <p>loading：{{ loading }}</p>
    <p>当前请求次数：{{ count }}</p>
    <button @click="polling">
      开始轮询
    </button>
    <button @click="stop">
      停止轮询
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

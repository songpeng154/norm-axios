<script setup lang="ts">
import type { ResponseContent } from 'vue-rex'
import { useRequest } from 'vue-rex'

const asyncAwait = async (millisecond: number) => new Promise(resolve => setTimeout(resolve, millisecond))

// 获取假数据
const getFakeData = async (now: number | string): Promise<ResponseContent<number>> => {
  await asyncAwait(500)

  if (typeof now === 'string') return [null, { msg: '参数类型错误', code: 400 }]
  return [now, undefined]
}

const { data, error, loading, run, refresh } = useRequest(getFakeData, {
  onBefore(params) {
    console.log('请求之前触发')
  },
  onSuccess(data, params, response) {
    console.log('请求成功触发')
  },
  onError(error, params, response) {
    console.log('请求失败触发')
  },
  onFinally(params) {
    console.log('最后执行,不管 service 成功失败都会执行')
  },
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
    <p v-if="error">
      错误信息：{{ error.msg }}
    </p>
    <button @click="run(Date.now())">
      手动执行
    </button>
    <button @click="run('错误')">
      模拟错误
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

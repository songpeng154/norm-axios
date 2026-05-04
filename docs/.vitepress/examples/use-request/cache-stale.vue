<script setup lang="ts">
import { createRequest } from 'vue-rex'

const useApi = createRequest({ dataKey: 'data' })

interface Product {
  id: number
  name: string
  price: number
}

const getProducts = async (): Promise<{ data: Product[] }> => {
  await new Promise(resolve => setTimeout(resolve, 1500))
  return {
    data: [
      { id: 1, name: 'JavaScript 高级程序设计', price: 89 },
      { id: 2, name: 'Vue.js 实战', price: 65 },
      { id: 3, name: '算法导论', price: 128 },
    ],
  }
}

const { data, run, loading } = useApi(getProducts, {
  cacheKey: 'stale-products',
  staleTime: 5000, // 5 秒内数据视为"新鲜"，不会重新请求
})
</script>

<template>
  <div>
    <p class="desc">
      设置 staleTime=5000ms，数据在 5 秒内视为新鲜，重复点击按钮不会重复请求，直接从缓存读取。
    </p>
    <div v-if="loading" class="state-box loading">
      正在加载商品列表...（2 秒延迟）
    </div>
    <div v-else-if="data" class="state-box success">
      <h3>商品列表</h3>
      <ul>
        <li v-for="product in data" :key="product.id">
          <strong>{{ product.name }}</strong>
          <span class="price">￥{{ product.price }}</span>
        </li>
      </ul>
    </div>
    <div v-else class="state-box loading">
      暂无数据，点击按钮发起请求。
    </div>
    <div class="actions">
      <button :disabled="loading" @click="run()">
        请求商品列表
      </button>
      <span class="hint">5 秒内重复点击不会发起新请求</span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.demo-card { padding: 0; }
.desc { font-size: 13px; color: var(--vp-c-text-2); margin: 0 0 12px; }
.state-box { padding: 12px; border-radius: 6px; margin-bottom: 12px; }
.loading { background: var(--vp-c-bg-soft); color: var(--vp-c-text-2); }
.success { background: var(--vp-c-brand-soft); }
h3 { margin: 0 0 8px; font-size: 15px; }
ul { margin: 0; padding-left: 20px; }
li { margin-bottom: 4px; }
.price { color: #e74c3c; margin-left: 8px; font-weight: bold; }
.actions { display: flex; align-items: center; gap: 12px; }
button { background: #5e7aeb; color: #fff; border: none; padding: 6px 16px; border-radius: 4px; cursor: pointer; font-size: 13px; }
button:disabled { opacity: 0.4; cursor: not-allowed; }
.hint { font-size: 12px; color: var(--vp-c-text-2); }
</style>

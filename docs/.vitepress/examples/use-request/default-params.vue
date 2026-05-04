<script setup lang="ts">
import { createRequest } from 'vue-rex'

const useApi = createRequest({ dataKey: 'data' })

interface Article {
  id: number
  title: string
  category: string
}

// service 接受分类 ID 作为参数
const getArticles = async (categoryId: number): Promise<{ data: Article[] }> => {
  await new Promise(resolve => setTimeout(resolve, 1000))
  const all: Record<number, Article[]> = {
    1: [{ id: 1, title: 'Vue 3 组合式 API 入门', category: '前端' }],
    2: [{ id: 2, title: 'Node.js 性能优化指南', category: '后端' }],
  }
  return { data: all[categoryId] || [] }
}

// 通过 defaultParams 设置默认参数，自动发起请求，无需手动调用 run
const { data, loading } = useApi(getArticles, {
  defaultParams: [1],
})
</script>

<template>
  <div>
    <p class="desc">
      defaultParams 自动传入参数并立即发起请求，无需手动调用 run()。适合不需要用户交互的自动加载场景。
    </p>
    <div v-if="loading" class="state-box loading">
      正在加载文章列表...
    </div>
    <div v-else-if="data" class="state-box success">
      <h3>文章列表（默认分类 ID: 1）</h3>
      <ul>
        <li v-for="article in data" :key="article.id">
          <strong>{{ article.title }}</strong>
          <span class="category">{{ article.category }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.demo-card { padding: 0; }
.desc { font-size: 13px; color: var(--vp-c-text-2); margin: 0 0 12px; }
.state-box { padding: 12px; border-radius: 6px; }
.loading { background: var(--vp-c-bg-soft); color: var(--vp-c-text-2); }
.success { background: var(--vp-c-brand-soft); }
h3 { margin: 0 0 8px; font-size: 15px; }
ul { margin: 0; padding-left: 20px; }
li { margin-bottom: 4px; }
.category { color: var(--vp-c-text-2); margin-left: 8px; font-size: 13px; background: #e8e8e8; padding: 1px 6px; border-radius: 3px; }
</style>

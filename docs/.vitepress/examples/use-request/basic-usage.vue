<script setup lang="ts">
import { createRequest } from 'vue-rex'

// 1. 创建实例：dataKey 告诉 vue-rex 从响应的哪个字段提取数据
const useApi = createRequest({ dataKey: 'data' })

// 2. 定义数据模型
interface User {
  id: number
  name: string
  email: string
}

// 3. 定义 service 函数，返回 Promise（模拟后端响应格式）
const getUsers = async (): Promise<{ data: User[] }> => {
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 1000))
  return {
    data: [
      { id: 1, name: '张三', email: 'zhangsan@example.com' },
      { id: 2, name: '李四', email: 'lisi@example.com' },
      { id: 3, name: '王五', email: 'wangwu@example.com' },
    ],
  }
}

// 4. 调用 useApi，自动发起请求
//    data 的类型会自动推导为 User[]
const { data, loading, error } = useApi(getUsers)
</script>

<template>
  <div>
    <!-- loading 状态 -->
    <div v-if="loading" class="state-box loading">
      ⏳ 正在加载用户列表...
    </div>

    <!-- error 状态 -->
    <div v-else-if="error" class="state-box error">
      ❌ 请求失败：{{ error.message || '未知错误' }}
    </div>

    <!-- data 状态 -->
    <div v-else-if="data" class="state-box success">
      <h3>用户列表（共 {{ data.length }} 人）</h3>
      <ul>
        <li v-for="user in data" :key="user.id">
          <strong>{{ user.name }}</strong>
          <span class="email">{{ user.email }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.demo-card { padding: 0; }
.state-box {
  padding: 12px;
  border-radius: 6px;
}
.loading { background: var(--vp-c-bg-soft); color: var(--vp-c-text-2); }
.error { background: #ffebee; color: #c62828; color: #d32f2f; }
.success { background: var(--vp-c-brand-soft); }
h3 { margin: 0 0 8px; font-size: 15px; }
ul { margin: 0; padding-left: 20px; }
li { margin-bottom: 4px; }
.email { color: var(--vp-c-text-2); margin-left: 8px; font-size: 13px; }
</style>

<script setup lang="ts">
import { createRequest } from 'vue-rex'

const useApi = createRequest({ dataKey: 'data' })

// 模拟后端返回的 snake_case 字段名
interface RawUser {
  user_name: string
  user_email: string
  register_time: string
}

// 通过 formatData 转换为前端友好的 camelCase 格式
interface FormattedUser {
  userName: string
  userEmail: string
  registerTime: string
}

const getUsers = async (): Promise<{ data: RawUser[] }> => {
  await new Promise(resolve => setTimeout(resolve, 1000))
  return {
    data: [
      { user_name: '张三', user_email: 'zhangsan@example.com', register_time: '2024-01-15' },
      { user_name: '李四', user_email: 'lisi@example.com', register_time: '2024-03-22' },
      { user_name: '王五', user_email: 'wangwu@example.com', register_time: '2024-06-08' },
    ],
  }
}

const { data, loading } = useApi<FormattedUser[]>(getUsers, {
  formatData: (raw: RawUser[]): FormattedUser[] =>
    raw.map(item => ({
      userName: item.user_name,
      userEmail: item.user_email,
      registerTime: item.register_time,
    })),
})
</script>

<template>
  <div>
    <p class="desc">
      formatData 将后端 snake_case 字段自动转换为前端 camelCase 风格，无需手动遍历。
    </p>
    <div v-if="loading" class="state-box loading">
      正在加载用户数据...
    </div>
    <div v-else-if="data" class="state-box success">
      <h3>用户列表（已格式化）</h3>
      <ul>
        <li v-for="user in data" :key="user.userEmail">
          <strong>{{ user.userName }}</strong>
          <span class="meta">{{ user.userEmail }}</span>
          <span class="meta">注册于 {{ user.registerTime }}</span>
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
li { margin-bottom: 6px; }
.meta { color: var(--vp-c-text-2); margin-left: 8px; font-size: 13px; }
</style>

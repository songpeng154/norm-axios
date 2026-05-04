import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    // 启用类似 jest 的全局测试 API
    globals: true,
    // 使用 happy-dom 模拟 DOM
    environment: 'happy-dom',
  },
})

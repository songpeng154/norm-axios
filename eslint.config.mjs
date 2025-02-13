import config from '@antfu/eslint-config'

export default config(
  {
    lessOpinionated: true,
    unocss: true,
  },
  {
    rules: {
    // 打印语句
      'no-console': 'off',
      // 强制所有控制语句使用一致的括号样式
      'curly': ['error', 'multi'],
    },
  },
)

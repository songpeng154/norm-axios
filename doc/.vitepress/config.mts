import UnoCSS from 'unocss/vite'
import { defineConfig } from 'vitepress'
import { setupContainerDemo } from './container/demo'

export default defineConfig({
  lang: 'zh-CN',
  title: 'Vue Rex 使用文档',
  description: 'Vue Rex 是一个基于 Vue 3 的高度解耦、类型安全且插件化的请求 Hook 库',
  cleanUrls: true,
  markdown: {
    theme: {
      dark: 'github-dark',
      light: 'github-light',
    },
    async config(md) {
      setupContainerDemo(md)
    },
    lineNumbers: true,
  },
  vite: {
    server: {
      hmr: true,
    },
    plugins: [
      UnoCSS(),
    ],
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler',
        },
      },
    },
  },
  themeConfig: {
    logo: '/assets/images/logo.png',
    darkModeSwitchLabel: '主题',
    darkModeSwitchTitle: '切换到深色模式',
    lightModeSwitchTitle: '切换到浅色模式',
    returnToTopLabel: '回到顶部',
    langMenuLabel: '切换语言',
    sidebarMenuLabel: '目录',
    skipToContentLabel: '跳转到内容',
    notFound: {
      linkLabel: '首页',
      linkText: '🔙 返回地球（主页）',
      title: '🚀 “Oops！页面被外星人劫持了…”\n',
      quote: '我们派出的星际侦察队确认，该页面已被外星人打包带走，理由可能是‘地球网页设计太好看，值得学习',
    },
    outline: {
      label: '页面导航',
    },
    docFooter: {
      next: '下一页',
      prev: '上一页',
    },
    nav: [
      {
        text: '文档',
        link: '/document/start/introduction',
        activeMatch: '^/document/',
      },
      {
        text: ' API参考',
        link: '/api-reference/common-type/home',
        activeMatch: '^/api-reference/',
      },
      // {
      //   text: ' 最佳实践',
      //   link: 'https://github.com/SurgeJS/surge-admin',
      // },
      {
        text: ' 联系作者',
        link: '/contact',
      },
    ],

    sidebar: {
      '/document': [
        {
          text: '开始',
          base: '/document/start',
          items: [
            { text: '介绍', link: '/introduction' },
            { text: '快速上手', link: '/start-quickly' },
          ],
        },

        {
          text: 'hook 全局配置',
          link: '/document/global-config',
        },
        {
          text: 'use-request',
          base: '/document/use-request',
          items: [
            { text: '介绍', link: '/introduction' },
            { text: '基础用法', link: '/basic-usage' },
            { text: '保持&延迟Loading', link: '/loading' },
            { text: '防抖', link: '/debounce' },
            { text: '节流', link: '/throttle' },
            { text: '缓存 & SWR', link: '/cache-swr' },
            { text: '数据突变', link: '/data-mutation' },
            { text: '错误重试', link: '/error-retry' },
            { text: '依赖刷新', link: '/dependency-refresh' },
            { text: '轮询请求', link: '/polling-request' },
            { text: '依赖请求', link: '/dependency-request' },
            { text: '并行请求', link: '/parallel-request' },
            { text: '伪取消请求', link: '/cancel-request' },
            { text: '格式化数据', link: '/formatting-data' },
            { text: '窗口聚焦时重新请求', link: '/refresh-on-window-focus' },
          ],
        },
        {
          text: 'use-pagination',
          link: '/document/use-pagination',
        },
      ],
      '/api-reference': [
        {
          text: '通用类型',
          link: '/api-reference/common-type/home',
        },

        {
          text: 'hooks',
          base: '/api-reference/hooks',
          items: [
            {
              text: 'useRequest',
              link: '/use-request/home',
            },
            {
              text: 'usePagination',
              link: '/use-pagination/home',
            },
            {
              text: 'useGlobalConfigProvider',
              link: '/use-global-config-provider/home',
            },
          ],
        },
      ],
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/songpeng154/vue-rex.git' },
    ],
  },
})

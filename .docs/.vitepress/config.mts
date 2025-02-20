import { defineConfig } from 'vitepress'
import { setupContainerDemo } from "./container/demo";
import UnoCSS from 'unocss/vite'

export default defineConfig({
    lang: 'zh-CN',
    title: 'Tudo Admin文档',
    description: '开箱即用、简单高效',
    cleanUrls: true,
    markdown: {
        config(md) {
            setupContainerDemo(md)
        },
        lineNumbers: true
    },
    vite: {
        server: {
            hmr: true,
        },
        plugins: [
            UnoCSS(),
        ],
    },
    themeConfig: {
        logo: '/assets/images/logo.png',
        darkModeSwitchLabel: '主题',
        darkModeSwitchTitle: '切换到深色模式',
        lightModeSwitchTitle: '切换到浅色模式',
        returnToTopLabel: '回到顶部',
        outline: {
            label: '页面导航',
        },
        docFooter: {
            next: '下一页',
            prev: '上一页',
        },
        nav: [
            { text: '介绍', link: '/introduction' },
            {
                text: '前端指南',
                link: '/frontEndGuide/start/introduction',
            },
            {
                text: '后端指南',
                items: [
                    {
                        text: '单服务版本',
                        link: '/introduction'
                    },
                    {
                        text: '微服务版本',
                        link: '/frontEndIntroduction'
                    },
                    {
                        text: 'Nest版本',
                        link: '/frontEndIntroduction'
                    }
                ]
            }
        ],

        sidebar: {
            '/frontEndGuide': [
                {
                    text: '开始',
                    base: '/frontEndGuide/start',
                    items: [
                        { text: '介绍', link: '/introduction' },
                        { text: '快速上手', link: '/getStartedQuickly' }
                    ]
                },
                {
                    text: '基础',
                    base: '/frontEndGuide/basis',
                    items: [
                        { text: '环境配置', link: '/envConfig' },
                        { text: '服务请求 & 数据模拟Fake', link: '/serviceRequest' },
                        { text: '路由&菜单', link: '/routeAndMenu' },
                        { text: '权限控制', link: '/auth' },
                        { text: '浏览器缓存', link: '/localCache' },
                        { text: '主题', link: '/theme' },
                    ]
                },
                {
                    text: '功能',
                    base: '/frontEndGuide/function',
                    items: [
                        { text: '图标', link: '/icon' },
                        { text: '表单', link: '/form' },
                    ]
                }
            ],
        },

        socialLinks: [
            { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
        ]
    }
})

import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import Demo from '../components/Demo.vue'
import 'virtual:uno.css'

export default {
  extends: DefaultTheme,
  Layout: DefaultTheme.Layout,
  enhanceApp({ app, router, siteData }) {
    app.component('Demo', Demo)
  },
} satisfies Theme

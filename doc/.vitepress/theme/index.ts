import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import Demo from '../components/Demo.vue'
import Layout from '../components/Layout.vue'
import 'virtual:uno.css'
import './style.css'

export default {
  extends: DefaultTheme,
  Layout,
  enhanceApp({ app }) {
    if (!import.meta.env.SSR)
      app.component('Demo', Demo)
  },
} satisfies Theme

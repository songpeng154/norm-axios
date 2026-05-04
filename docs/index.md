---
layout: home

hero:
  name: "Vue Rex"
  text: "让请求更简单"
  tagline: 工厂函数模式，一次配置，处处复用
  image:
    src: /logo.png
    alt: Vue Rex
  actions:
    - theme: brand
      text: 开始使用
      link: /document/start/introduction
    - theme: alt
      text: 快速上手
      link: /document/start/start-quickly

features:
  - icon: 🏭
    title: 工厂函数模式
    details: createRequest / createPagination 创建可复用实例，在项目入口统一配置，全局共享
  - icon: 🛡️
    title: TypeScript 类型推导
    details: 根据 service 返回类型和 dataKey 自动推导 data 类型，无需手动标注
  - icon: 🌐
    title: 多后端适配
    details: dataKey / listKey + totalKey 统一不同后端响应结构，告别路径穿透
  - icon: 💾
    title: 缓存 & SWR
    details: 内置内存缓存 + Stale-While-Revalidate，列表页切走再回来秒开
  - icon: ⚡
    title: 防抖 / 节流 / 轮询 / 重试
    details: debounceRun、throttleRun、pollingInterval、errorRetryCount 传参即用
  - icon: 🔌
    title: 插件化扩展
    details: definePlugin 自定义插件，请求生命周期全链路可介入
---

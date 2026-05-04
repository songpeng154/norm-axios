---
layout: home

hero:
  name: "Vue Rex"
  text: "Requests made simple"
  tagline: Factory function pattern — configure once, reuse everywhere
  image:
    src: /logo-light.svg
    alt: Vue Rex
  actions:
    - theme: brand
      text: Get Started
      link: /en/document/start/introduction
    - theme: alt
      text: Quick Start
      link: /en/document/start/start-quickly

features:
  - icon: 🏭
    title: Factory Pattern
    details: createRequest / createPagination create reusable instances — configure once at project entry, share globally
  - icon: 🛡️
    title: TypeScript Inference
    details: data type auto-inferred from service return type and dataKey — no manual type annotations
  - icon: 🌐
    title: Backend Adaptation
    details: dataKey / listKey + totalKey unify different backend response structures — no more path drilling
  - icon: 💾
    title: Cache & SWR
    details: Built-in memory cache + Stale-While-Revalidate for instant page restores
  - icon: ⚡
    title: Debounce / Throttle / Polling / Retry
    details: debounceRun, throttleRun, pollingInterval, errorRetryCount — just pass the option
  - icon: 🔌
    title: Plugin System
    details: definePlugin for custom request lifecycle hooks — full pipeline access
---

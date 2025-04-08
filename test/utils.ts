import type { App } from 'vue'
import type { ResponseContent } from '../src'
import { createApp } from 'vue'

export function withSetup<T>(composable: () => T): [T, App] {
  let result!: T
  const app = createApp({
    setup() {
      result = composable()
      // 忽略模板警告
      return () => {}
    },
  })

  app.mount(document.createElement('div'))

  // 返回结果与应用实例
  return [result, app]
}

export function asyncAwait(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export function mockResponse(responseContent: ResponseContent, ms: number): () => Promise<ResponseContent> {
  return async () => {
    await asyncAwait(ms)
    return responseContent
  }
}

export function mockParamsResponse(ms: number): (params: any) => Promise<ResponseContent> {
  return async (params: any) => {
    await asyncAwait(ms)
    return [params]
  }
}

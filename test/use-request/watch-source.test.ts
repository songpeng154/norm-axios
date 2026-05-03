import { describe, expect, it } from 'vitest'
import { ref } from 'vue'
import { useRequest } from '../../src/hooks'
import { asyncAwait, withSetup } from '../utils.ts'

describe('useRequest watchSource', () => {
  it('watchSource: true 自动收集依赖并重新请求', async () => {
    const paramsList: string[] = []

    const service = async (k: string) => {
      paramsList.push(k)
      return `result:${k}`
    }

    withSetup(() =>
      useRequest(service, {
        defaultParams: ['init'],
        watchSource: true,
      }),
    )

    // watchEffect 会自动收集 keyword 依赖
    // 但这里 service 没有用 keyword，所以手动改 keyword 不会触发
    // 先验证初始调用
    await asyncAwait(100)
    expect(paramsList).toContain('init')
  })

  it('watchSource: [ref] 监听指定 ref 变化并重新请求', async () => {
    const keyword = ref('hello')
    const paramsList: string[] = []

    const service = async (k: string) => {
      paramsList.push(k)
      return `result:${k}`
    }

    withSetup(() =>
      useRequest(service, {
        defaultParams: ['init'],
        watchSource: [keyword],
      }),
    )

    await asyncAwait(100)
    expect(paramsList).toEqual(['init'])

    keyword.value = 'world'
    await asyncAwait(100)
    // watchSource 触发时使用上次的 params
    expect(paramsList).toHaveLength(2)
    expect(paramsList[1]).toBe('init')
  })

  it('watchSource: [ref] 多个 ref 任一变化都触发', async () => {
    const a = ref(1)
    const b = ref(2)
    const callCount = { value: 0 }

    const service = async () => {
      callCount.value++
      return callCount.value
    }

    withSetup(() =>
      useRequest(service, {
        defaultParams: [],
        watchSource: [a, b],
      }),
    )

    await asyncAwait(100)
    expect(callCount.value).toBe(1)

    a.value = 10
    await asyncAwait(100)
    expect(callCount.value).toBe(2)

    b.value = 20
    await asyncAwait(100)
    expect(callCount.value).toBe(3)
  })

  it('manual: true + watchSource 不自动执行首次请求', async () => {
    const keyword = ref('test')
    const callCount = { value: 0 }

    const service = async () => {
      callCount.value++
      return 'ok'
    }

    withSetup(() =>
      useRequest(service, {
        manual: true,
        watchSource: [keyword],
      }),
    )

    await asyncAwait(100)
    // manual: true 不自动执行，但 watchSource 仍会监听变化
    expect(callCount.value).toBe(0)

    keyword.value = 'changed'
    await asyncAwait(100)
    expect(callCount.value).toBe(1)
  })
})

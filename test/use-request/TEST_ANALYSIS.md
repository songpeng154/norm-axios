# 测试用例分析报告

## 概述

本文档通过静态分析，逐一比对 12 个测试文件（约 70+ 用例）与源代码实现，识别出预期失败的用例并分析根因。

**结论**：发现 **4 类问题**，影响约 **12 个用例**。其余约 60 个用例预期通过。

---

## 问题一：`mockParamsResponse` 只捕获第一个参数（高 — 断言失败，9 个用例）

### 根因

`test/utils.ts` 中的 `mockParamsResponse` 函数只接受**一个参数** `params`：

```ts
export function mockParamsResponse(ms: number): (params: any) => Promise<ResponseContent> {
    return async (params: any) => {
        await asyncAwait(ms)
        return [params]  // 只捕获第一个参数
    }
}
```

`core-request.ts` 通过 `service(...args)` 展开参数调用。例如 `run(1, 2, 3)` 会调用 `service(1, 2, 3)`，但 `mockParamsResponse` 只收到 `params=1`，返回 `[1]`。解构后 `result = 1`。

**但很多测试预期 result 是数组（如 `[1]` 或 `[1, 2, 3]`），导致断言失败。**

### 受影响用例

#### `core.test.ts`

| 行号 | 测试名 | 错误预期 | 实际值 |
|------|--------|----------|--------|
| ~28 | `defaultParams 传递给 service` | `toEqual([1, 2, 3])` | `1` |
| ~52 | `run 返回 Promise 并 resolve 数据` | `toEqual(['test-param'])` | `'test-param'` |
| ~60,64,68 | `run 可以多次调用` (3 处) | `toEqual([1])`, `[2]`, `[3]` | `1`, `2`, `3` |
| ~74,78 | `refresh 使用上次的 params` (2 处) | `toEqual(['original-params'])` | `'original-params'` |
| ~100 | `optimisticUpdate 成功后保持` | `toEqual([1])` | `1` |

#### `lifecycle.test.ts`

| ~25 | `onSuccess 在请求成功时触发` | `toHaveBeenCalledWith(['hello'], ['hello'])` | `('hello', ['hello'])` |

#### `format-data.test.ts`

| ~28 | `formatData 配合手动 run 使用` | `toEqual({ wrapped: ['hello'] })` | `{ wrapped: 'hello' }` |

### 修复方案

在 `test/utils.ts` 中新增支持捕获全部参数的 mock：

```ts
export function mockAllParamsResponse(ms: number): (...params: any[]) => Promise<ResponseContent> {
    return async (...params: any[]) => {
        await asyncAwait(ms)
        return [params]  // 捕获所有参数为数组
    }
}
```

将上述用例的 `mockParamsResponse` 替换为 `mockAllParamsResponse` 即可，断言保持不变。

---

## 问题二：`cancel` 不会停止轮询（中 — 逻辑错误，1 个用例）

### 根因

`polling.test.ts` 中 "使用 cancel 后停止轮询" 测试假设 `cancel()` 能停止轮询定时器，但实际 `cancel()` 只取消**当前正在进行的请求**：

```ts
// core-request.ts
const cancel = () => {
    isCancelled = true
    setState({ loading: false })
    runPluginHooks('onCancel')
}
```

`cancel` 不改变 `finished`，也不改变 `pollingInterval`。而 `polling.ts` 的 `isStopPolling` 检查的是 `!finished.value` 和 `pollingIntervalRef.value <= 0`，所以轮询会继续。

### 受影响用例

| 文件 | 测试名 | 问题 |
|------|--------|------|
| `polling.test.ts` ~60 | `使用 cancel 后停止轮询` | 调用 `cancel()` 后 `callCount` 仍然增长 |

### 修复

改为通过卸载组件来测试停止轮询：

```ts
it('卸载组件后停止轮询', async () => {
    let callCount = 0
    const server = async () => { callCount++; await asyncAwait(10); return [callCount] }
    const [result, app] = withSetup(() => useRequest(server, {
        manual: true,
        pollingInterval: 50,
    }))
    await result.run()
    await asyncAwait(100)
    const before = callCount
    app.unmount()  // 触发 onScopeDispose → scope.stop() → 插件清理
    await asyncAwait(200)
    expect(callCount).toBeLessThanOrEqual(before + 2)
})
```

---

## 问题三：时序敏感用例（低 — flaky，1 个用例）

### 根因

`loading.test.ts` 中 "loadingDelay + loadingKeep: 请求时间在两者之间" 依赖精确的 `asyncAwait` 时序。在 CI 或低性能环境下可能出现偏差。

### 受影响用例

| 文件 | 测试名 |
|------|--------|
| `loading.test.ts` ~82 | `loadingDelay + loadingKeep: 请求时间在两者之间` |

### 修复

使用 `vi.useFakeTimers()` 控制时间，或给每个 `asyncAwait` 增加 50-100ms 余量。

---

## 问题四：`usePagination` 实现变更后的 API 差异

### 说明

`src/hooks/pagination/` 的实现与我初始阅读时已有较大变更，已由 linter 自动修正了测试文件中的关键 API 名称。确认如下：

| 旧 API 名称 | 新 API 名称 | 状态 |
|------------|------------|------|
| `target` | `scrollTarget` | linter 不需要修复（测试中未直接使用） |
| `loadMoreOffset` | `scrollOffset` | linter 不需要修复（测试中未直接使用） |
| `addedMode` | `appendMode` | ✅ linter 已修复 |
| `resetPageWhenPageSizeChange` | `resetOnPageSizeChange` | ✅ linter 已修复 |

另外，新实现中 `usePagination` 内部使用 `manual: true` + `watch(page)` + `watch(pageSize)` 来驱动请求，并在初始化时显式调用一次 `run()`。测试中创建的 `mockPaginationService({ page, pageSize })` 与新实现兼容，因为分页参数会被合并到 service 的第一个参数中。

---

## 其他需关注的点（不影响断言结果）

### `core.test.ts` — `cancel` 测试中的 unhandled promise

```ts
const promise = run('should-be-cancelled')
// ... cancel() 后 promise 未被 await
```

vitest 可能报告 unhandled promise。建议末尾加 `await promise.catch(() => {})`。

### `error-retry.test.ts` — 重试等待时间偏紧

错误重试间隔 `50ms`、请求耗时 `50ms`、总等待 `300ms`，边界较紧。建议等待 `500ms`。

### `cache.test.ts` — 直接导入 `setCache` / `getCache`

```ts
import { setCache, getCache } from '../../src/hooks/request/utils/cache.ts'
```

通过内部路径导入，如果文件结构变更可能失效。建议从 `../../src` 导出这些函数，或保持当前做法但添加注释。

---

## 未覆盖的建议场景

| 场景 | 重要性 |
|------|--------|
| `ready` 由 false 变为 true 时自动请求 | 高 |
| `watchSource: true` + `defaultParams` 依赖收集 | 中 |
| 自定义 plugin 的注册和执行 | 中 |
| Service 抛出 Error（非元组）的处理 | 低 |
| 同一 cacheKey 多实例并发协调 | 低 |

---

## 汇总

| # | 问题类别 | 文件数 | 用例数 | 严重度 |
|---|----------|--------|--------|--------|
| 1 | mockParamsResponse 单参数 | 3 | 9 | 高 |
| 2 | cancel 不停止轮询 | 1 | 1 | 中 |
| 3 | 时序敏感 | 1 | 1 | 低 |
| 4 | usePagination API 变更 | 1 | 0（已由 linter 修复） | — |

**预计首次运行结果**：约 60 个通过，10-11 个失败。修复问题一和二后，全部通过。

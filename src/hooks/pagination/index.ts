import type { PaginationAndFetchOptions, PaginationResult } from './types.ts'
import type { RequestServiceFn } from '../request/types.ts'
import { useEventListener } from '@vueuse/core'
import { inject, computed, ref, watch, toValue } from 'vue'
import { GLOBAL_CONFIG_PROVIDER_SYMBOL } from '../global'
import { useRequest } from '../request'

export function usePagination<
  // service resolve 的原始类型（任意结构）
  TData = any,
  // service 的参数类型
  TParams extends any[] = any[],
  // 列表项类型，从 dataSerializer 推导
  TItem = any,
>(
  service: RequestServiceFn<TData, TParams>,
  options: PaginationAndFetchOptions<TData, TParams, TItem> = {},
): PaginationResult<TData, TParams, TItem> {
  const globalProvider = inject(GLOBAL_CONFIG_PROVIDER_SYMBOL, {} as any)
  const globalPagination = (globalProvider.pagination || {}) as any

  const {
    scrollTarget,
    scrollOffset = 100,
    initialPage = 1,
    initialPageSize = 10,
    appendMode = false,
    resetOnPageSizeChange = true,
    paginationSerializer = globalPagination.paginationSerializer ?? ((page: number, pageSize: number) => ({ page, pageSize })),
    dataSerializer = globalPagination.dataSerializer ?? ((data: any) => ({
      list: data?.list ?? [],
      total: data?.total ?? 0,
    })),
    defaultParams,
    onSuccess,
    ...restOptions
  } = options

  // ─── 分页状态 ───────────────────────────────────────────────
  const page = ref(initialPage)
  const pageSize = ref(initialPageSize)
  // 追加模式下积累的列表
  const accList = ref<TItem[]>([])

  // ─── 核心请求 ────────────────────────────────────────────────
  const fetchInstance = useRequest<TData, TParams>(
    (...args: TParams) => {
      const [firstArg, ...rest] = args as any[]
      const paginationArg = paginationSerializer(page.value, pageSize.value)
      const mergedFirst = firstArg && typeof firstArg === 'object' && !Array.isArray(firstArg)
        ? { ...firstArg, ...paginationArg }
        : paginationArg
      return (service as any)(mergedFirst, ...rest)
    },
    {
      ...restOptions,
      manual: true,
      onSuccess(data: TData, params: TParams) {
        // 追加模式：新数据追加到末尾
        if (toValue(appendMode)) {
          const { list } = dataSerializer(data)
          accList.value = [...accList.value, ...list] as TItem[]
        }
        onSuccess?.(data, params)
      },
    },
  )

  // ─── 派生计算 ─────────────────────────────────────────────────
  const serialized = computed(() =>
    fetchInstance.data.value !== undefined
      ? dataSerializer(fetchInstance.data.value)
      : { list: [] as TItem[], total: 0 },
  )

  const total = computed(() => serialized.value.total)
  const totalPage = computed(() => Math.max(1, Math.ceil(total.value / pageSize.value)))
  const isLastPage = computed(() => page.value >= totalPage.value)
  const hasMore = computed(() => !isLastPage.value)

  const list = computed<TItem[]>(() => {
    if (toValue(appendMode))
      return accList.value
    return serialized.value.list
  })

  // ─── 分页操作 ─────────────────────────────────────────────────
  const run = () => {
    const params = defaultParams ?? ([] as unknown as TParams)
    return fetchInstance.run(...params).catch(() => {})
  }

  const reset = () => {
    page.value = initialPage
    accList.value = []
  }

  const loadMore = () => {
    if (!isLastPage.value && fetchInstance.finished.value)
      page.value += 1
  }

  // ─── 响应式触发 ────────────────────────────────────────────────
  watch(page, () => {
    run()
  })

  watch(pageSize, () => {
    if (resetOnPageSizeChange && page.value !== initialPage) {
      reset()
    }
    else {
      run()
    }
  })

  // 初始化执行一次（manual: true 时跳过）
  if (!restOptions.manual)
    run()

  // ─── 滚动加载 ─────────────────────────────────────────────────
  if (scrollTarget) {
    useEventListener(scrollTarget, 'scroll', (event) => {
      const { scrollHeight, scrollTop, clientHeight } = event.target as HTMLElement
      const nearBottom = scrollTop + clientHeight >= scrollHeight - scrollOffset
      if (nearBottom && hasMore.value && fetchInstance.finished.value) {
        loadMore()
      }
    })
  }

  // ─── 返回值 ───────────────────────────────────────────────────
  return {
    ...fetchInstance,
    run,
    list,
    page,
    pageSize,
    total,
    totalPage,
    isLastPage,
    hasMore,
    loadMore,
  }
}

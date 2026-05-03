import type { RequestServiceFn } from '../request/types.ts'
import type { PaginationData, PaginationOptions, PaginationResult } from './types.ts'
import { computed, ref, watch } from 'vue'
import { useRequest } from '../request'

export function usePagination<
  TData = any,
  TParams extends [Record<string, any>] = [Record<string, any>],
  TItem = any,
  TFormatData = TItem,
>(
  service: RequestServiceFn<TData, TParams>,
  options: PaginationOptions<TData, TParams, TItem, TFormatData>,
): PaginationResult<TData, TParams, TItem, TFormatData> {
  const {
    dataSerializer,
    formatList,
    paginationSerializer = (page, pageSize) => ({ page, pageSize } as Partial<TParams[0]>),
    initialPage = 1,
    initialPageSize = 10,
    pageWatch = true,
    resetPageWhenPageSizeChange = true,
    watchSource,
    ...restOptions
  } = options

  // ─── 分页状态 ─────────────────────────────────────────────
  const page = ref(initialPage)
  const pageSize = ref(initialPageSize)

  // ─── 包装 service，注入分页参数 ───────────────────────────
  const wrappedService = (...args: TParams) => {
    const [firstArg] = args
    const paginationArg = paginationSerializer(page.value, pageSize.value)
    const mergedArg = { ...firstArg, ...paginationArg }
    return service(...[mergedArg] as unknown as TParams)
  }

  // ─── formatList → formatData ─────────────────────────────
  const formatData = formatList
    ? (data: PaginationData<TItem>, rawData: TData, params: TParams): PaginationData<TFormatData> => ({
        list: formatList(data.list, rawData, params),
        total: data.total,
      })
    : undefined

  // ─── 调用 useRequest ──────────────────────────────────────
  const fetchInstance = useRequest<TData, TParams, PaginationData<TItem>, PaginationData<TFormatData>>(
    wrappedService,
    {
      ...restOptions,
      manual: true,
      watchSource: pageWatch && watchSource === true ? undefined : watchSource,
      dataSerializer,
      formatData,
    },
  )

  const paginationData = computed(() =>
    fetchInstance.data.value ?? { list: [] as TFormatData[], total: 0 },
  )

  const list = computed<TFormatData[]>(() => paginationData.value.list)

  const total = computed(() => paginationData.value.total)
  const totalPage = computed(() => Math.max(1, Math.ceil(total.value / pageSize.value)))
  const isLastPage = computed(() => page.value >= totalPage.value)

  watch(page, () => {
    if (pageWatch)
      fetchInstance.refresh().catch(() => {})
  })

  watch(pageSize, () => {
    const wasPage1 = page.value === 1
    if (resetPageWhenPageSizeChange)
      page.value = 1
    if (wasPage1)
      fetchInstance.refresh().catch(() => {})
  })

  const reset = () => {
    page.value = initialPage
  }

  // ─── 返回值 ───────────────────────────────────────────────
  return {
    ...fetchInstance,
    list,
    page,
    pageSize,
    total,
    totalPage,
    isLastPage,
    reset,
  }
}

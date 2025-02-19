import type { PaginationAndFetchOptions, PaginationResponse, PaginationResult, PaginationServiceFn } from './types.ts'
import { useEventListener } from '@vueuse/core'
import { omit } from 'es-toolkit'
import { computed, inject, ref, watch } from 'vue'
import { useFetch } from '../fetch'
import { GLOBAL_PROVIDER_SYMBOL } from '../global'

export const usePagination = <
  // 数据
  TData extends PaginationResponse = PaginationResponse,
  // 方法参数
  TParams extends unknown[] = unknown[],
  // 格式化数据
  TFormatData extends PaginationResponse = TData,
  // 原始数据
  TRawData = any,
> (
  service: PaginationServiceFn<TData, TRawData>,
  options: PaginationAndFetchOptions<TData, TParams, TFormatData, TRawData> = {},
): PaginationResult<TData, TParams, TFormatData, TRawData> => {
  const globalProvider = inject(GLOBAL_PROVIDER_SYMBOL)

  const config: PaginationAndFetchOptions<TData, TParams, TFormatData, TRawData> = Object.assign(options, globalProvider?.pagination)

  const {
    target,
    initialPage = 1,
    initialPageSize = 10,
    loadMoreOffset = 100,
    pageWatch = true,
    resetPageWhenPageSizeChange = true,
    addedMode,
    onSuccess,
  } = config

  // 当前页数
  const page = ref(initialPage)
  // 每页数量
  const pageSize = ref(initialPageSize)
  // 上次分页
  const lastPage = ref(initialPage)

  // 列表数据
  const list = ref <TFormatData['list']> ([] as TFormatData['list'])

  const fetchInstance = useFetch<TData, TParams, TFormatData, TRawData>(
    () => service({ page: page.value, pageSize: pageSize.value }),
    {
      ...omit(config, [
        'target',
        'initialPage',
        'initialPageSize',
        'pageWatch',
      ]),
      onSuccess(data, params, response) {
        onSuccess?.(data, params, response)
        if (!addedMode) return
        // 数据追加
        list.value = (page.value <= lastPage.value ? data.list : [...list.value, ...data.list]) ?? []
        lastPage.value = page.value
      },
    },
  )

  // 总数
  const total = computed(() => fetchInstance.data.value?.total ?? 0)
  // 分页总数
  const totalPage = computed(() => Math.ceil(total.value / pageSize.value))
  // 是否是最后一页
  const isLastPage = computed(() => page.value === totalPage.value)

  // 监听滚动到底部，滚动到底部分页自动+1
  useEventListener(target, 'scroll', (event) => {
    const { scrollHeight, scrollTop, clientHeight } = event.target as HTMLElement
    if (scrollTop + clientHeight >= scrollHeight - loadMoreOffset && !isLastPage.value && fetchInstance.finished.value)
      page.value += 1
  })

  // 分页变化的时候刷新请求
  pageWatch && watch(page, () => fetchInstance.refresh())

  // 当分页数量变化的时候重置分页
  resetPageWhenPageSizeChange && watch(pageSize, () => page.value = 1)

  return {
    ...fetchInstance,
    list: computed(() => addedMode ? list.value : fetchInstance.data.value?.list ?? []),
    page,
    pageSize,
    total,
    totalPage,
    isLastPage,
  }
}

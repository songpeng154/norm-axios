import { asyncAwait } from '../utils.ts'

export interface UserItem { id: number, name: string }
export interface ApiResponse { records: UserItem[], totalCount: number }

export const TOTAL = 25

export const mockService = async (params: { page: number, pageSize: number }): Promise<ApiResponse> => {
  await asyncAwait(30)
  const { page, pageSize } = params
  const start = (page - 1) * pageSize
  const records: UserItem[] = []
  for (let i = start; i < Math.min(start + pageSize, TOTAL); i++)
    records.push({ id: i + 1, name: `User ${i + 1}` })
  return { records, totalCount: TOTAL }
}

export const dataSerializer = (data: ApiResponse) => ({
  list: data.records,
  total: data.totalCount,
})

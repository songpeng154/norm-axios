export interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
}

export interface UserInfo {
  id: number
  name: string
  email: string
}

export interface ListResult<T> {
  list: T[]
  total: number
  page: number
  pageSize: number
}

export interface ApiError {
  code: number
  message: string
}

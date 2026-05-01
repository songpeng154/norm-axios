// 响应错误
export interface ResponseError {
  code?: number | string
  msg: string
  [key: string]: any
}

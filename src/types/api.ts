export interface ApiErrorBody {
  message?: string
  code?: string
  [key: string]: unknown
}

export interface ApiResponse<T> {
  data: T
  meta?: {
    total?: number
    page?: number
    perPage?: number
  }
}

export interface PaginationParams {
  page?: number
  perPage?: number
}

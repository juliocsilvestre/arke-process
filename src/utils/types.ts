export type Pagination = {
  page?: string
  q?: string
  limit?: string
}

export type DateFormatOptions = {
  day: 'numeric' | '2-digit' | undefined
  month: 'numeric' | '2-digit' | 'long' | undefined
  year: 'numeric' | '2-digit' | undefined
}

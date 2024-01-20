import { AxiosError } from 'axios'

interface FieldError<K> {
  field: K
  message: string
}

export const checkError = <T>(error: unknown): string | FieldError<T>[] | undefined => {
  if (!(error instanceof AxiosError)) return
  if (error.response?.data?.message) return error.response.data.message
  if (error.response?.data?.errors)
    return error.response.data.errors.map((error: FieldError<T>) => ({ field: error.field, message: error.message }))
}

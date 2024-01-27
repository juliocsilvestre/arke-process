import { useRouter } from '@tanstack/react-router'
import { useDebounce } from '@uidotdev/usehooks'
import { useEffect } from 'react'

interface useDebouncedSearchTermParams {
  searchTerm: string
  callback: (debouncedSearchTerm: string) => void
  delay?: number
}

export const useDebouncedSearchTerm = ({ searchTerm, callback, delay = 800 }: useDebouncedSearchTermParams) => {
  const { navigate } = useRouter()
  const debouncedSearchTerm = useDebounce(searchTerm, delay)

  useEffect(() => {
    callback(debouncedSearchTerm)
  }, [debouncedSearchTerm, navigate])
}

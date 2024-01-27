import { useRouter } from '@tanstack/react-router'
import { useDebounce } from '@uidotdev/usehooks'
import { useEffect } from 'react'
import { toast } from 'sonner'

interface useDebouncedSearchTermParams {
  searchTerm: string
  callback: (debouncedSearchTerm: string) => void
  delay?: number
}

export const useDebouncedSearchTerm = ({ searchTerm, callback, delay = 400 }: useDebouncedSearchTermParams) => {
  const { navigate } = useRouter()
  const debouncedSearchTerm = useDebounce(searchTerm, delay)

  useEffect(() => {
    const callbackPromise = () =>
      new Promise((resolve) => setTimeout(() => resolve(callback(debouncedSearchTerm)), delay))

    toast.promise(callbackPromise, {
      loading: 'Carregando... ⏳',
      success: 'Carregado com sucesso! 🚀',
      error: 'Erro ao carregar. Tente novamente. 🤯',
      duration: delay,
      dismissible: true,
    })
  }, [debouncedSearchTerm, navigate])
}

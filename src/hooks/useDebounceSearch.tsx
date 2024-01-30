import { useRouter } from '@tanstack/react-router'
import { useDebounce } from '@uidotdev/usehooks'
import { useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'

interface useDebouncedSearchTermParams {
  searchTerm: string
  callback?: (debouncedSearchTerm: string) => void
  isComboboxOpen?: boolean
  delay?: number
}

interface comboboxDebouncedSearchTermParams {
  debouncedSearchTerm: string
  delay?: number
  isLoadFinished?: boolean
}

interface runCallbackWithDebouncedSearchTermParams {
  debouncedSearchTerm: string
  callback: (debouncedSearchTerm: string) => void
  delay?: number
  isLoadFinished?: boolean
}

interface comboboxSearchResult {
  isResolved: boolean
  debouncedSearchTerm: string
}

interface callbackSearchResult {
  isResolved: boolean
}

interface useDebouncedSearchTermProps {
  comboboxParameters: comboboxSearchResult
  callbackParameters: callbackSearchResult
}

const comboboxDebouncedSearchTerm = ({
  debouncedSearchTerm,
  delay = 500,
  isLoadFinished = false,
}: comboboxDebouncedSearchTermParams): string => {
  const debouncedSearchTermPromise = () =>
    new Promise((resolve) => setTimeout(() => resolve({ id: 'debounce', debouncedSearchTerm }), delay))

  toast.promise(debouncedSearchTermPromise, {
    loading: 'Buscando... 🔍',
    success: 'Busca realizada com sucesso! 🚀',
    error: 'Erro ao buscar. Tente novamente. 🤯',
    duration: delay,
    position: 'bottom-right',
    onAutoClose: () => {
      isLoadFinished = true
    },
  })

  clearTimeout('debounce')

  return debouncedSearchTerm
}

const runCallbackWithDebouncedSearchTerm = ({
  debouncedSearchTerm,
  callback,
  delay = 400,
  isLoadFinished = false,
}: runCallbackWithDebouncedSearchTermParams): void => {
  const callbackPromise = () =>
    new Promise((resolve) => setTimeout(() => resolve(callback(debouncedSearchTerm)), delay))

  toast.promise(callbackPromise, {
    loading: 'Buscando... 🔍',
    success: 'Busca realizada com sucesso! 🚀',
    error: 'Erro ao buscar. Tente novamente. 🤯',
    duration: delay,
    dismissible: true,
    onAutoClose: () => {
      isLoadFinished = true
    },
  })
}

export const useDebounceSearch = ({
  isComboboxOpen = false,
  searchTerm,
  callback,
  delay = 400,
}: useDebouncedSearchTermParams): useDebouncedSearchTermProps => {
  const { navigate } = useRouter()
  const [comboboxParameters, setComboboxParameters] = useState<comboboxSearchResult>({
    isResolved: false,
    debouncedSearchTerm: '',
  } as comboboxSearchResult)
  const [callbackParameters, setCallbackParameters] = useState<callbackSearchResult>({
    isResolved: false,
  } as callbackSearchResult)

  const debouncedSearchTerm = useDebounce(searchTerm, delay)
  const memoizedDebouncedSearchTerm = useMemo(() => debouncedSearchTerm, [debouncedSearchTerm])

  useEffect(() => {
    if (callback) {
      runCallbackWithDebouncedSearchTerm({ debouncedSearchTerm: memoizedDebouncedSearchTerm, callback })
      setCallbackParameters({ isResolved: true })
    }
    if (isComboboxOpen) {
      const debouncedSearchTerm = comboboxDebouncedSearchTerm({ debouncedSearchTerm: memoizedDebouncedSearchTerm })
      setComboboxParameters({ isResolved: true, debouncedSearchTerm })
    }
  }, [memoizedDebouncedSearchTerm, navigate])

  return { comboboxParameters, callbackParameters }
}

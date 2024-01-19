import { CreateWorkerBody } from '@/pages/Workers.defs'
import { useMutation } from '@tanstack/react-query'
import { api } from '../api'

export const useCreateWorker = () => {
  const mutation = useMutation({
    mutationFn: (worker: CreateWorkerBody) => {
      const formData = new FormData()

      for (const [key, value] of Object.entries(worker)) {
        formData.append(key, value)
      }

      return api.post('/workers', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
    },
  })

  return { ...mutation }
}

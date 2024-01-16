import { useMutation } from '@tanstack/react-query'
import { api } from '../api'

export const useSignInMutation = () => {
  const mutation = useMutation({
    mutationFn: (credentials: { cpf: string; password: string }) => {
      return api.post('/auth/signin', credentials)
    },
  })

  return { ...mutation }
}

export const useSignOutMutation = () => {
    const mutation = useMutation({
        mutationFn: () => {
        return api.delete('/auth/signoff')
        },
    })
    
    return { ...mutation }
}
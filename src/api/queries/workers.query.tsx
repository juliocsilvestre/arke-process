import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

export const useGetAddresByCep = (cep: string) => {
  const query = useQuery({
    queryKey: ['address', cep],
    queryFn: async () => {
      const { data } = await axios.get(`https://viacep.com.br/ws/${cep}/json/`)
      return data
    },
    enabled: cep.length === 9,
  })

  return { ...query }
}

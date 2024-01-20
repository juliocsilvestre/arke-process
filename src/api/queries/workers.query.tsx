import { queryOptions, useQuery } from '@tanstack/react-query'
import axios from 'axios'

import { api } from '../api'

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

export const getWorkers = async () => await api.get('/workers')
export const indexWorkersQueryOption = queryOptions({
  queryKey: ['workers'],
  queryFn: getWorkers,
})

export const useIndexWorkers = () => {
  const workers = useQuery(indexWorkersQueryOption)

  return { workers }
}

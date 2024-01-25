import { BuildingOfficeIcon, ChartBarIcon, ShieldCheckIcon, TicketIcon, UserGroupIcon } from '@heroicons/react/24/solid'
import { DateFormatOptions } from './types'

export const SIZE = {
  xs: 'xs',
  sm: 'sm',
  md: 'md',
  lg: 'lg',
  xl: 'xl',
} as const

export const CPF_REGEXP = /^(\d{3}.?\d{3}.?\d{3}-?\d{2})$/
export const CNPJ_REGEXP = /^(\d{2}.?\d{3}.?\d{3}\/?\d{4}-?\d{2})$/
export const PHONE_REGEXP = /^(\(\d{2}\) \d{5}-\d{4})$/
export const CEP_REGEXP = /^(\d{5}-?\d{3})$/

export const UF_LIST = {
  AC: 'AC',
  AL: 'AL',
  AP: 'AP',
  AM: 'AM',
  BA: 'BA',
  CE: 'CE',
  DF: 'DF',
  ES: 'ES',
  GO: 'GO',
  MA: 'MA',
  MT: 'MT',
  MS: 'MS',
  MG: 'MG',
  PA: 'PA',
  PB: 'PB',
  PR: 'PR',
  PE: 'PE',
  PI: 'PI',
  RJ: 'RJ',
  RN: 'RN',
  RS: 'RS',
  RO: 'RO',
  RR: 'RR',
  SC: 'SC',
  SP: 'SP',
  SE: 'SE',
  TO: 'TO',
} as const

export type UF = (typeof UF_LIST)[keyof typeof UF_LIST]

export const NAVIGATION = [
  {
    name: 'Administradores',
    href: '/dashboard/administradores',
    icon: ShieldCheckIcon,
    released: true,
  },
  { name: 'Funcionários', href: '/dashboard/funcionarios', icon: UserGroupIcon, released: true },
  {
    name: 'Fornecedores',
    href: '/dashboard/fornecedores',
    icon: BuildingOfficeIcon,
    released: true,
  },
  { name: 'Eventos', href: '/dashboard/eventos', icon: TicketIcon, released: true },
  { name: 'Relatórios', href: '/dashboard/relatorios', icon: ChartBarIcon, released: false },
]

export const WORKER_STATUS = {
  active: 'active',
  expelled: 'expelled',
  banished: 'banished',
} as const

export type WorkerStatus = (typeof WORKER_STATUS)[keyof typeof WORKER_STATUS]

export const MAX_FILE_SIZE = 1024 * 1024 * 2 // 2MB
export const ACCEPTED_IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif']

export const WORKER_STATUS_MAPPER: {
  [key: string]: { label: string; color: 'success' | 'secondary' | 'error' }
} = {
  [WORKER_STATUS.active]: {
    label: 'Ativo',
    color: 'success',
  },
  [WORKER_STATUS.expelled]: {
    label: 'Expulso',
    color: 'secondary',
  },
  [WORKER_STATUS.banished]: {
    label: 'Banido',
    color: 'error',
  },
} as const

export const formatDate = (dateString: string | number | Date) => {
  const options: DateFormatOptions = {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }
  const rawDate = new Date(dateString)
  const sanitizedDate = rawDate.toLocaleDateString('pt-BR', options)
  return sanitizedDate
}

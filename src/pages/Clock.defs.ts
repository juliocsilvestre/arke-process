export type Entry = {
  entry_at: Date
  name: string
  type: 'in' | 'out'
}

export const ENTRY_NAMES = {
  in: 'Entrada',
  out: 'Saída',
} as const

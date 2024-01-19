import { z } from 'zod'

export const CreateEventSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'Nome deve conter pelo menos 2 caracteres.' })
    .max(50, { message: 'Nome deve conter no máximo 50 caracteres.' }),
  dates: z.object({
    from: z.date(),
    to: z.date(),
  }),
})

export type CreateEventBody = z.infer<typeof CreateEventSchema>

export type EventDay = {
  id: string
  event_id: string
  date: Date
  created_at: Date
  updated_at: Date
}

export interface Company {
  id: string
  name: string
  admin_id: string
  days: EventDay[]
  created_at: Date
  updated_at: Date
  deleted_at: Date
}

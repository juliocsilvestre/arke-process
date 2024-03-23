import { ColumnDef } from '@tanstack/react-table'
import { CPF_REGEXP, formatDate } from '@utils/constants'
import * as z from 'zod'

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}

export const UserRoleOptions = [
  { value: UserRole.ADMIN, label: 'Administrador' },
  { value: UserRole.USER, label: 'Usuário' },
]

export const CreateAdminSchema = z.object({
  name: z
    .string()
    .min(3, { message: 'Nome deve conter pelo menos 3 caracteres.' })
    .max(50, { message: 'Nome deve conter no máximo 50 caracteres.' }),
  email: z.union([z.string().email(), z.literal('')]),
  role: z.nativeEnum(UserRole),
  cpf: z.string().refine(
    (cpf) => {
      return CPF_REGEXP.test(cpf.toString())
    },
    {
      message: 'Credenciais inválidas',
    },
  ),
  password: z.union([
    z.undefined(),
    z
      .string()
      .min(10, {
        message: 'Credenciais inválidas',
      })
      .optional(),
  ]),
})

export const EditAdminSchema = z.object({
  name: z
    .string()
    .min(3, { message: 'Nome deve conter pelo menos 3 caracteres.' })
    .max(50, { message: 'Nome deve conter no máximo 50 caracteres.' }),
  email: z.union([z.string().email(), z.literal('')]),
  cpf: z.string().refine(
    (cpf) => {
      return CPF_REGEXP.test(cpf.toString())
    },
    {
      message: 'Credenciais inválidas',
    },
  ),
})

export interface Admin {
  id: string
  name: string
  cpf: string
  role: UserRole
  email: string
  created_at: Date
  updated_at: Date
}

export const adminsColumns: ColumnDef<Admin>[] = [
  {
    accessorKey: 'name',
    header: 'Nome',
  },
  {
    accessorKey: 'cpf',
    header: 'CPF',
  },
  {
    accessorKey: 'role',
    header: 'Papel',
    cell: ({ row }) => {
      const role = row.getValue('role')

      if (role === UserRole.ADMIN) {
        return 'Administrador'
      }

      return 'Usuário'
    },
  },
  {
    accessorKey: 'email',
    header: 'E-mail',
  },
  {
    accessorKey: 'created_at',
    header: 'Criado em',
    cell: ({ row }) => {
      const date = new Date(row.getValue('created_at'))
      return formatDate(date)
    },
  },
  {
    accessorKey: 'updated_at',
    header: 'Atualizado em',
    cell: ({ row }) => {
      const date = new Date(row.getValue('updated_at'))
      return formatDate(date)
    },
  },
]

export type CreateAdminBody = z.infer<typeof CreateAdminSchema>
export type AdminBodyKeys = keyof CreateAdminBody

import { CPF_REGEXP, formatDate } from "@utils/constants";
import * as z from "zod";
import { ColumnDef } from "@tanstack/react-table";

export const CreateAdminSchema = z.object({
    name: z
        .string()
        .min(3, { message: "Nome deve conter pelo menos 3 caracteres." })
        .max(50, { message: "Nome deve conter no máximo 50 caracteres." }),
    email: z.union([z.string().email(), z.literal("")]),
    cpf: z.string().refine(
        (cpf) => {
            return CPF_REGEXP.test(cpf.toString());
        },
        {
            message: "Credenciais inválidas",
        }
    ),
    password: z.string().min(10, {
        message: "Credenciais inválidas",
    }),
});

export interface Admin {
    id: string;
    name: string;
    cpf: string;
    email: string;
    created_at: Date;
    updated_at: Date;
}

export const adminsColumns: ColumnDef<Admin>[] = [
    {
        accessorKey: "name",
        header: "Nome",
    },
    {
        accessorKey: "cpf",
        header: "CPF",
    },
    {
        accessorKey: "email",
        header: "E-mail",
    },
    {
        accessorKey: "created_at",
        header: "Criado em",
        cell: ({ row }) => {
            const date = new Date(row.getValue("created_at"));
            return formatDate(date);
        },
    },
    {
        accessorKey: "updated_at",
        header: "Atualizado em",
        cell: ({ row }) => {
            const date = new Date(row.getValue("updated_at"));
            return formatDate(date);
        },
    },
    // TODO: add actions
    // {
    //   header: 'Ações',
    //   id: 'actions',
    //   cell: ({ row }) => {
    //     const company = row.original

    //     return (
    //       <div className="flex justify-start">
    //         <_DeleteCompanyButton company={company} />
    //       </div>
    //     )
    //   },
    // },
];

export type CreateAdminBody = z.infer<typeof CreateAdminSchema>;
export type AdminBodyKeys = keyof CreateAdminBody;

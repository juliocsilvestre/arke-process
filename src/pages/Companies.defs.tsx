import { ColumnDef } from "@tanstack/react-table";
import { Tooltip } from "react-tooltip";
import { z } from "zod";

import { useDeleteCompany } from "@/api/mutations/companies.mutation";
import { Button } from "@/components/ui/Button";
import { TrashIcon } from "@heroicons/react/24/solid";
import { CNPJ_REGEXP, formatDate } from "@utils/constants";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { ConfirmationModal } from "@/components/ConfirmationModal";

export const CreateCompanySchema = z.object({
    name: z
        .string()
        .min(2, { message: "Nome deve conter pelo menos 2 caracteres." })
        .max(50, { message: "Nome deve conter no máximo 50 caracteres." }),
    cnpj: z.string().refine(
        (v) => {
            return CNPJ_REGEXP.test(v.toString());
        },
        { message: "CNPJ inválido." }
    ),
});

export type CreateCompanyBody = z.infer<typeof CreateCompanySchema>;
export type CompanyBodyKeys = keyof CreateCompanyBody;

export interface Company {
    id: string;
    name: string;
    cnpj: string;
    admin_id: string;
    created_at: string;
    updated_at: string;
}

const _DeleteCompanyButton = ({ company }: { company: Company }) => {
    const { mutateAsync: deleteCompany } = useDeleteCompany();

    const onDeleteCompany = async (company: Company): Promise<void> => {
        try {
            await deleteCompany(company.id);
            toast.success(<p>O fornecedor "{company.name}" foi excluído com sucesso!</p>);
        } catch (error: unknown) {
            if (!(error instanceof AxiosError)) return;
            console.error(error.response?.data.message);
        }
    };

    return (
        <ConfirmationModal
            title={
                <span>
                    Você tem certeza de que deseja apagar <strong>"{company.name}"</strong>?
                </span>
            }
            description="Esta ação não pode ser desfeita. Isso excluirá permanentemente o fornecedor."
            variant={"destructive"}
            actionButtonLabel="Apagar"
            onAction={() => void onDeleteCompany(company)}
        >
            <Button
                data-tooltip-id={`delete-company-${company.id}`}
                data-tooltip-content={`Apagar "${company.name}"`}
                variant="destructive"
                size="icon"
            >
                <TrashIcon className="w-4 h-4" />
            </Button>
            <Tooltip id={`delete-company-${company.id}`} place="top" />
        </ConfirmationModal>
    );
};

export const companiesColumns: ColumnDef<Company>[] = [
    {
        accessorKey: "name",
        header: "Nome",
    },
    {
        accessorKey: "cnpj",
        header: "CNPJ",
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
    {
        header: "Ações",
        id: "actions",
        cell: ({ row }) => {
            const company = row.original;

            return (
                <div className="flex justify-start">
                    <_DeleteCompanyButton company={company} />
                </div>
            );
        },
    },
];

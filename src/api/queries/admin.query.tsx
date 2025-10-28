import { Pagination } from "@/utils/types";
import { queryOptions, useQuery } from "@tanstack/react-query";
import { api } from "../api";

export const getAdmins = async (pagination?: Pagination) => {
  // Mock data para demonstração
  const mockAdmins = [
    {
      id: "1",
      name: "Carlos Alberto Silva",
      cpf: "111.222.333-44",
      role: "admin",
      email: "carlos.admin@carvalheira.com.br",
      created_at: new Date("2024-01-01T10:00:00Z"),
      updated_at: new Date("2024-01-01T10:00:00Z"),
    },
    {
      id: "2",
      name: "Maria Santos Oliveira",
      cpf: "555.666.777-88",
      role: "admin",
      email: "maria.admin@carvalheira.com.br",
      created_at: new Date("2024-01-05T10:00:00Z"),
      updated_at: new Date("2024-01-05T10:00:00Z"),
    },
    {
      id: "3",
      name: "João Pereira Costa",
      cpf: "999.888.777-66",
      role: "user",
      email: "joao.user@carvalheira.com.br",
      created_at: new Date("2024-01-10T10:00:00Z"),
      updated_at: new Date("2024-01-10T10:00:00Z"),
    },
    {
      id: "4",
      name: "Ana Beatriz Lima",
      cpf: "123.987.654-32",
      role: "admin",
      email: "ana.admin@carvalheira.com.br",
      created_at: new Date("2024-01-15T10:00:00Z"),
      updated_at: new Date("2024-01-15T10:00:00Z"),
    },
    {
      id: "5",
      name: "Roberto Carlos Souza",
      cpf: "456.123.789-01",
      role: "user",
      email: "roberto.user@carvalheira.com.br",
      created_at: new Date("2024-01-20T10:00:00Z"),
      updated_at: new Date("2024-01-20T10:00:00Z"),
    },
  ];

  // Simular paginação
  const page = parseInt(pagination?.page || "1");
  const limit = 10; // Limite fixo para admins
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;

  // Filtrar por query se fornecida
  let filteredAdmins = mockAdmins;
  if (pagination?.q) {
    const query = pagination.q.toLowerCase();
    filteredAdmins = mockAdmins.filter(
      (admin) =>
        admin.name.toLowerCase().includes(query) ||
        admin.cpf.includes(query) ||
        admin.email.toLowerCase().includes(query) ||
        admin.role.toLowerCase().includes(query)
    );
  }

  const paginatedAdmins = filteredAdmins.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredAdmins.length / limit);

  // Simular delay da API
  await new Promise((resolve) => setTimeout(resolve, 300));

  return {
    data: {
      admins: {
        data: paginatedAdmins,
        meta: {
          current_page: page,
          last_page: totalPages,
          per_page: limit,
          total: filteredAdmins.length,
          next_page_url: page < totalPages ? `/admins?page=${page + 1}` : null,
          previous_page: page > 1 ? `/admins?page=${page - 1}` : null,
        },
      },
    },
  };
};

export const indexAdminsQueryOption = (pagination?: Pagination) =>
  queryOptions({
    queryKey: ["admins", pagination],
    queryFn: () => getAdmins(pagination),
    refetchOnWindowFocus: false,
  });

export const useIndexAdmins = (pagination?: Pagination) => {
  return useQuery(indexAdminsQueryOption(pagination));
};

export const getSingleAdmin = async (id: string) => {
  // Mock data para demonstração
  const mockAdmin = {
    id: id,
    name: "Carlos Alberto Silva",
    cpf: "111.222.333-44",
    role: "admin",
    email: "carlos.admin@carvalheira.com.br",
    created_at: new Date("2024-01-01T10:00:00Z"),
    updated_at: new Date("2024-01-01T10:00:00Z"),
  };

  // Simular delay da API
  await new Promise((resolve) => setTimeout(resolve, 300));

  return { data: mockAdmin };
};

export const useSingleAdmin = (id: string) => {
  const admin = useQuery({
    queryKey: ["adminDetail", id],
    queryFn: () => getSingleAdmin(id),
    refetchOnWindowFocus: false,
  });

  return { admin };
};

import { Pagination } from "@/utils/types";
import {
  infiniteQueryOptions,
  queryOptions,
  useInfiniteQuery,
  useQuery,
} from "@tanstack/react-query";
import { api } from "../api";

export const getCompanies = async (pagination?: Pagination) => {
  // Mock data para demonstração
  const mockCompanies = [
    {
      id: "1",
      name: "Restaurante Bella Vista",
      cnpj: "12.345.678/0001-90",
      admin_id: "1",
      created_at: "2024-01-01T10:00:00Z",
      updated_at: "2024-01-01T10:00:00Z",
    },
    {
      id: "2",
      name: "Bar do Zé",
      cnpj: "98.765.432/0001-10",
      admin_id: "1",
      created_at: "2024-01-05T10:00:00Z",
      updated_at: "2024-01-05T10:00:00Z",
    },
    {
      id: "3",
      name: "Hotel Paradise",
      cnpj: "11.222.333/0001-44",
      admin_id: "1",
      created_at: "2024-01-10T10:00:00Z",
      updated_at: "2024-01-10T10:00:00Z",
    },
    {
      id: "4",
      name: "Café Central",
      cnpj: "55.666.777/0001-88",
      admin_id: "1",
      created_at: "2024-01-15T10:00:00Z",
      updated_at: "2024-01-15T10:00:00Z",
    },
    {
      id: "5",
      name: "Padaria do Bairro",
      cnpj: "22.333.444/0001-55",
      admin_id: "1",
      created_at: "2024-01-20T10:00:00Z",
      updated_at: "2024-01-20T10:00:00Z",
    },
    {
      id: "6",
      name: "Pizzaria Napoli",
      cnpj: "88.999.000/0001-77",
      admin_id: "1",
      created_at: "2024-01-25T10:00:00Z",
      updated_at: "2024-01-25T10:00:00Z",
    },
  ];

  // Simular paginação
  const page = parseInt(pagination?.page || "1");
  const limit = parseInt(pagination?.limit || "10");
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;

  // Filtrar por query se fornecida
  let filteredCompanies = mockCompanies;
  if (pagination?.q) {
    const query = pagination.q.toLowerCase();
    filteredCompanies = mockCompanies.filter(
      (company) =>
        company.name.toLowerCase().includes(query) ||
        company.cnpj.includes(query)
    );
  }

  const paginatedCompanies = filteredCompanies.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredCompanies.length / limit);

  // Simular delay da API
  await new Promise((resolve) => setTimeout(resolve, 300));

  return {
    data: {
      companies: {
        data: paginatedCompanies,
        meta: {
          current_page: page,
          last_page: totalPages,
          per_page: limit,
          total: filteredCompanies.length,
          next_page_url:
            page < totalPages ? `/companies?page=${page + 1}` : null,
          previous_page: page > 1 ? `/companies?page=${page - 1}` : null,
        },
      },
    },
  };
};

export const infiniteCompaniesQueryOptions = (
  isComboboxOpen: boolean,
  pagination?: Pagination
) => {
  return infiniteQueryOptions({
    queryKey: ["infinite-companies", pagination],
    queryFn: async () => await getCompanies(pagination),
    initialPageParam: 1,
    enabled: isComboboxOpen,
    select: (data) => {
      return {
        companies: [...data.pages[0].data.companies.data],
        currentPage: data.pages[0].data.companies.meta.current_page,
        nextPage: data.pages[0].data.companies.meta.next_page_url,
        lastPage: data.pages[0].data.companies.meta.last_page,
      };
    },
    getNextPageParam: (nextPage) => {
      const nextPageUrl = nextPage.data.companies.meta.next_page_url;
      if (!nextPageUrl) return null;
      const pageMatch = nextPageUrl.match(/page=(\d+)/);
      return pageMatch ? parseInt(pageMatch[1]) : null;
    },
    getPreviousPageParam: (previousPage) => {
      const prevPageUrl = previousPage.data.companies.meta.previous_page;
      if (!prevPageUrl) return null;
      const pageMatch = prevPageUrl.match(/page=(\d+)/);
      return pageMatch ? parseInt(pageMatch[1]) : null;
    },
    refetchOnWindowFocus: false,
  });
};

export const useInfiniteCompanies = (
  isComboboxOpen: boolean,
  pagination?: Pagination
) => {
  return useInfiniteQuery(
    infiniteCompaniesQueryOptions(isComboboxOpen, pagination)
  );
};

export const indexCompaniesQueryOptions = (pagination?: Pagination) =>
  queryOptions({
    queryKey: ["companies", pagination],
    queryFn: () => getCompanies(pagination),
    refetchOnWindowFocus: false,
  });

export const useIndexCompanies = (pagination?: Pagination) => {
  return useQuery(indexCompaniesQueryOptions(pagination));
};

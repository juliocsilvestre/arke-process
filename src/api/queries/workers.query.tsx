import {
  infiniteQueryOptions,
  queryOptions,
  useInfiniteQuery,
  useQuery,
} from "@tanstack/react-query";
import axios from "axios";

import { WorkerStatus } from "@/utils/constants";
import { Pagination } from "@/utils/types";
import { api } from "../api";

export const useGetAddresByCep = (cep?: string) => {
  const query = useQuery({
    queryKey: ["address", cep],
    queryFn: async () => {
      const { data } = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
      return data;
    },
    refetchOnWindowFocus: false,
    enabled: cep?.length === 9,
  });

  return { ...query };
};

export const getWorkers = async (
  pagination?: Pagination,
  filters?: { status: WorkerStatus }
) => {
  // Mock data para demonstração
  const mockWorkers = [
    {
      id: "1",
      full_name: "João Silva Santos",
      cpf: "123.456.789-01",
      rg: "12.345.678-9",
      email: "joao.silva@email.com",
      phone_number: "(11) 99999-1234",
      picture_url: "https://i.pravatar.cc/150?img=1",
      role: "Garçom",
      status: "active",
      issuing_agency: "SSP",
      issuing_state: "SP",
      issuing_date: "2015-01-15",
      emergency_name: "Maria Silva",
      emergency_number: "(11) 98888-5678",
      company: {
        id: "1",
        name: "Restaurante Bella Vista",
        cnpj: "12.345.678/0001-90",
        admin_id: "1",
        created_at: "2024-01-01T10:00:00Z",
        updated_at: "2024-01-01T10:00:00Z",
      },
      company_id: "1",
      admin_id: "1",
      created_at: "2024-01-15T10:00:00Z",
      updated_at: "2024-01-15T10:00:00Z",
    },
    {
      id: "2",
      full_name: "Maria Oliveira Costa",
      cpf: "987.654.321-02",
      rg: "98.765.432-1",
      email: "maria.oliveira@email.com",
      phone_number: "(11) 99999-5678",
      picture_url: "https://i.pravatar.cc/150?img=2",
      role: "Cozinheira",
      status: "active",
      issuing_agency: "SSP",
      issuing_state: "SP",
      issuing_date: "2018-03-20",
      emergency_name: "José Oliveira",
      emergency_number: "(11) 98888-9012",
      company: {
        id: "1",
        name: "Restaurante Bella Vista",
        cnpj: "12.345.678/0001-90",
        admin_id: "1",
        created_at: "2024-01-01T10:00:00Z",
        updated_at: "2024-01-01T10:00:00Z",
      },
      company_id: "1",
      admin_id: "1",
      created_at: "2024-02-10T10:00:00Z",
      updated_at: "2024-02-10T10:00:00Z",
    },
    {
      id: "3",
      full_name: "Carlos Roberto Lima",
      cpf: "456.789.123-03",
      rg: "45.678.912-3",
      email: "carlos.lima@email.com",
      phone_number: "(11) 99999-9012",
      picture_url: "https://i.pravatar.cc/150?img=3",
      role: "Barman",
      status: "expelled",
      issuing_agency: "SSP",
      issuing_state: "RJ",
      issuing_date: "2020-05-10",
      emergency_name: "Ana Lima",
      emergency_number: "(11) 98888-3456",
      company: {
        id: "2",
        name: "Bar do Zé",
        cnpj: "98.765.432/0001-10",
        admin_id: "1",
        created_at: "2024-01-05T10:00:00Z",
        updated_at: "2024-01-05T10:00:00Z",
      },
      company_id: "2",
      admin_id: "1",
      created_at: "2024-03-05T10:00:00Z",
      updated_at: "2024-03-05T10:00:00Z",
    },
    {
      id: "4",
      full_name: "Ana Paula Souza",
      cpf: "789.123.456-04",
      rg: "78.912.345-6",
      email: "ana.souza@email.com",
      phone_number: "(11) 99999-3456",
      picture_url: "https://i.pravatar.cc/150?img=4",
      role: "Recepcionista",
      status: "active",
      issuing_agency: "SSP",
      issuing_state: "MG",
      issuing_date: "2019-07-25",
      emergency_name: "Pedro Souza",
      emergency_number: "(11) 98888-7890",
      company: {
        id: "3",
        name: "Hotel Paradise",
        cnpj: "11.222.333/0001-44",
        admin_id: "1",
        created_at: "2024-01-10T10:00:00Z",
        updated_at: "2024-01-10T10:00:00Z",
      },
      company_id: "3",
      admin_id: "1",
      created_at: "2024-04-12T10:00:00Z",
      updated_at: "2024-04-12T10:00:00Z",
    },
    {
      id: "5",
      full_name: "Roberto Carlos Silva",
      cpf: "321.654.987-05",
      rg: "32.165.498-7",
      email: "roberto.carlos@email.com",
      phone_number: "(11) 99999-7890",
      picture_url: "https://i.pravatar.cc/150?img=5",
      role: "Segurança",
      status: "banished",
      issuing_agency: "SSP",
      issuing_state: "SP",
      issuing_date: "2017-12-01",
      emergency_name: "Lucia Silva",
      emergency_number: "(11) 98888-1234",
      company: {
        id: "3",
        name: "Hotel Paradise",
        cnpj: "11.222.333/0001-44",
        admin_id: "1",
        created_at: "2024-01-10T10:00:00Z",
        updated_at: "2024-01-10T10:00:00Z",
      },
      company_id: "3",
      admin_id: "1",
      created_at: "2024-05-20T10:00:00Z",
      updated_at: "2024-05-20T10:00:00Z",
    },
  ];

  // Simular paginação
  const page = parseInt(pagination?.page || "1");
  const limit = parseInt(pagination?.limit || "10");
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;

  // Filtrar por status se fornecido
  let filteredWorkers = mockWorkers;
  if (filters?.status) {
    filteredWorkers = mockWorkers.filter(
      (worker) => worker.status === filters.status
    );
  }

  // Filtrar por query se fornecida
  if (pagination?.q) {
    const query = pagination.q.toLowerCase();
    filteredWorkers = filteredWorkers.filter(
      (worker) =>
        worker.full_name.toLowerCase().includes(query) ||
        worker.cpf.includes(query) ||
        worker.role.toLowerCase().includes(query) ||
        worker.company.name.toLowerCase().includes(query)
    );
  }

  const paginatedWorkers = filteredWorkers.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredWorkers.length / limit);

  // Simular delay da API
  await new Promise((resolve) => setTimeout(resolve, 300));

  return {
    data: {
      workers: {
        data: paginatedWorkers,
        meta: {
          current_page: page,
          last_page: totalPages,
          per_page: limit,
          total: filteredWorkers.length,
          next_page_url: page < totalPages ? `/workers?page=${page + 1}` : null,
          previous_page: page > 1 ? `/workers?page=${page - 1}` : null,
        },
      },
    },
  };
};

export const infiniteWorkersQueryOptions = (
  isComboboxOpen: boolean,
  pagination?: Pagination,
  filters?: { status: WorkerStatus }
) => {
  return infiniteQueryOptions({
    queryKey: ["infinite-workers", pagination],
    queryFn: async () => await getWorkers(pagination, filters),
    initialPageParam: 1,
    enabled: isComboboxOpen,
    select: (data) => {
      return {
        workers: [...data.pages[0].data.workers.data],
        currentPage: data.pages[0].data.workers.meta.current_page,
        nextPage: data.pages[0].data.workers.meta.next_page_url,
        lastPage: data.pages[0].data.workers.meta.last_page,
      };
    },
    getNextPageParam: (nextPage) => {
      const nextPageUrl = nextPage.data.workers.meta.next_page_url;
      if (!nextPageUrl) return null;
      const pageMatch = nextPageUrl.match(/page=(\d+)/);
      return pageMatch ? parseInt(pageMatch[1]) : null;
    },
    getPreviousPageParam: (previousPage) => {
      const prevPageUrl = previousPage.data.workers.meta.previous_page;
      if (!prevPageUrl) return null;
      const pageMatch = prevPageUrl.match(/page=(\d+)/);
      return pageMatch ? parseInt(pageMatch[1]) : null;
    },
    refetchOnWindowFocus: false,
  });
};

export const useInfiniteWorkers = (
  isComboboxOpen: boolean,
  pagination?: Pagination,
  filters?: { status: WorkerStatus }
) => {
  return useInfiniteQuery(
    infiniteWorkersQueryOptions(isComboboxOpen, pagination, filters)
  );
};

export const indexWorkersQueryOptions = (pagination?: Pagination) =>
  queryOptions({
    queryKey: ["workers", pagination],
    queryFn: () => getWorkers(pagination),
    refetchOnWindowFocus: false,
  });

export const useIndexWorkers = (pagination?: Pagination) => {
  return useQuery(indexWorkersQueryOptions(pagination));
};

export const getSingleWorkerQueryOptions = (id: string) =>
  queryOptions({
    queryKey: ["worker", "single", id],
    queryFn: () => getSingleWorker(id),
    enabled: !!id,
  });

export const getSingleWorker = async (id: string) => {
  // Mock data para demonstração
  const mockWorker = {
    id: id,
    full_name: "João Silva Santos",
    cpf: "123.456.789-01",
    rg: "12.345.678-9",
    email: "joao.silva@email.com",
    phone_number: "(11) 99999-1234",
    picture_url: "https://i.pravatar.cc/150?img=1",
    role: "Garçom",
    status: "active",
    issuing_agency: "SSP",
    issuing_state: "SP",
    issuing_date: "2015-01-15",
    emergency_name: "Maria Silva",
    emergency_number: "(11) 98888-5678",
    company: {
      id: "1",
      name: "Restaurante Bella Vista",
      cnpj: "12.345.678/0001-90",
      admin_id: "1",
      created_at: "2024-01-01T10:00:00Z",
      updated_at: "2024-01-01T10:00:00Z",
    },
    company_id: "1",
    admin_id: "1",
    created_at: "2024-01-15T10:00:00Z",
    updated_at: "2024-01-15T10:00:00Z",
  };

  // Simular delay da API
  await new Promise((resolve) => setTimeout(resolve, 300));

  return { data: mockWorker };
};

export const useSingleWorker = (id: string) => {
  const worker = useQuery(getSingleWorkerQueryOptions(id));

  return { worker };
};

export const useGetQRCode = (workerId: string) => {
  const query = useQuery({
    queryKey: ["worker", "qrcode", workerId],
    queryFn: async () => {
      const { data } = await api.get(`/workers/${workerId}/qrcode`);
      return data;
    },
    refetchOnWindowFocus: false,
  });

  return { ...query };
};

import { Pagination } from "@/utils/types";
import { queryOptions, useQuery } from "@tanstack/react-query";
import { api } from "../api";

export const getEvents = async (pagination?: Pagination) => {
  // Mock data para demonstração
  const mockEvents = [
    {
      id: "1",
      name: "Festa de Casamento - Ana & Carlos",
      admin_id: "1",
      start_date: new Date("2024-11-15T18:00:00Z"),
      finish_date: new Date("2024-11-15T23:59:00Z"),
      days: [
        {
          id: "1",
          event_id: "1",
          date: new Date("2024-11-15T18:00:00Z"),
          created_at: new Date("2024-10-01T10:00:00Z"),
          updated_at: new Date("2024-10-01T10:00:00Z"),
        },
      ],
      created_at: new Date("2024-10-01T10:00:00Z"),
      updated_at: new Date("2024-10-01T10:00:00Z"),
      deleted_at: null,
    },
    {
      id: "2",
      name: "Conferência Empresarial TechCorp",
      admin_id: "1",
      start_date: new Date("2024-11-20T08:00:00Z"),
      finish_date: new Date("2024-11-22T18:00:00Z"),
      days: [
        {
          id: "2",
          event_id: "2",
          date: new Date("2024-11-20T08:00:00Z"),
          created_at: new Date("2024-10-05T10:00:00Z"),
          updated_at: new Date("2024-10-05T10:00:00Z"),
        },
        {
          id: "3",
          event_id: "2",
          date: new Date("2024-11-21T08:00:00Z"),
          created_at: new Date("2024-10-05T10:00:00Z"),
          updated_at: new Date("2024-10-05T10:00:00Z"),
        },
        {
          id: "4",
          event_id: "2",
          date: new Date("2024-11-22T08:00:00Z"),
          created_at: new Date("2024-10-05T10:00:00Z"),
          updated_at: new Date("2024-10-05T10:00:00Z"),
        },
      ],
      created_at: new Date("2024-10-05T10:00:00Z"),
      updated_at: new Date("2024-10-05T10:00:00Z"),
      deleted_at: null,
    },
    {
      id: "3",
      name: "Aniversário 50 Anos - Roberto",
      admin_id: "1",
      start_date: new Date("2024-12-01T19:00:00Z"),
      finish_date: new Date("2024-12-01T23:59:00Z"),
      days: [
        {
          id: "5",
          event_id: "3",
          date: new Date("2024-12-01T19:00:00Z"),
          created_at: new Date("2024-10-10T10:00:00Z"),
          updated_at: new Date("2024-10-10T10:00:00Z"),
        },
      ],
      created_at: new Date("2024-10-10T10:00:00Z"),
      updated_at: new Date("2024-10-10T10:00:00Z"),
      deleted_at: null,
    },
    {
      id: "4",
      name: "Formatura Turma 2024",
      admin_id: "1",
      start_date: new Date("2024-12-15T18:30:00Z"),
      finish_date: new Date("2024-12-15T23:30:00Z"),
      days: [
        {
          id: "6",
          event_id: "4",
          date: new Date("2024-12-15T18:30:00Z"),
          created_at: new Date("2024-10-15T10:00:00Z"),
          updated_at: new Date("2024-10-15T10:00:00Z"),
        },
      ],
      created_at: new Date("2024-10-15T10:00:00Z"),
      updated_at: new Date("2024-10-15T10:00:00Z"),
      deleted_at: null,
    },
    {
      id: "5",
      name: "Reveillon 2025",
      admin_id: "1",
      start_date: new Date("2024-12-31T22:00:00Z"),
      finish_date: new Date("2025-01-01T02:00:00Z"),
      days: [
        {
          id: "7",
          event_id: "5",
          date: new Date("2024-12-31T22:00:00Z"),
          created_at: new Date("2024-10-20T10:00:00Z"),
          updated_at: new Date("2024-10-20T10:00:00Z"),
        },
      ],
      created_at: new Date("2024-10-20T10:00:00Z"),
      updated_at: new Date("2024-10-20T10:00:00Z"),
      deleted_at: null,
    },
  ];

  // Simular paginação
  const page = parseInt(pagination?.page || "1");
  const limit = 10;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;

  // Filtrar por query se fornecida
  let filteredEvents = mockEvents;
  if (pagination?.q) {
    const query = pagination.q.toLowerCase();
    filteredEvents = mockEvents.filter((event) =>
      event.name.toLowerCase().includes(query)
    );
  }

  const paginatedEvents = filteredEvents.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredEvents.length / limit);

  // Simular delay da API
  await new Promise((resolve) => setTimeout(resolve, 300));

  return {
    data: {
      events: {
        data: paginatedEvents,
        meta: {
          current_page: page,
          last_page: totalPages,
          per_page: limit,
          total: filteredEvents.length,
          next_page_url: page < totalPages ? `/events?page=${page + 1}` : null,
          previous_page: page > 1 ? `/events?page=${page - 1}` : null,
        },
      },
    },
  };
};

export const indexEventsQueryOption = (pagination?: Pagination) =>
  queryOptions({
    queryKey: ["events", pagination],
    queryFn: () => getEvents(pagination),
    refetchOnWindowFocus: false,
  });

export const useIndexEvents = (pagination?: Pagination) => {
  return useQuery(indexEventsQueryOption(pagination));
};

export const singleEventQueryOption = (id: string) => {
  return queryOptions({
    queryKey: ["eventDetail", id],
    queryFn: () => getSingleEvent(id),
    refetchOnWindowFocus: false,
    enabled: !!id,
  });
};

export const getSingleEvent = async (id: string) => {
  // Mock data para demonstração
  const mockEvent = {
    id: id,
    name: "Festa de Casamento - Ana & Carlos",
    admin_id: "1",
    start_date: new Date("2024-11-15T18:00:00Z"),
    finish_date: new Date("2024-11-15T23:59:00Z"),
    days: [
      {
        id: "1",
        event_id: id,
        date: new Date("2024-11-15T18:00:00Z"),
        created_at: new Date("2024-10-01T10:00:00Z"),
        updated_at: new Date("2024-10-01T10:00:00Z"),
      },
    ],
    created_at: new Date("2024-10-01T10:00:00Z"),
    updated_at: new Date("2024-10-01T10:00:00Z"),
    deleted_at: null,
  };

  // Simular delay da API
  await new Promise((resolve) => setTimeout(resolve, 300));

  return { data: mockEvent };
};

export const useSingleEvent = (id: string) => {
  return useQuery(singleEventQueryOption(id));
};

export const getWorkersPerEventDay = async ({
  eventDayId,
  eventId,
  page,
  q,
}: {
  eventId?: string;
  eventDayId?: string;
  page?: string;
  q?: string;
}) => {
  // Mock data para demonstração
  const mockWorkersPerDay = [
    {
      id: "1",
      full_name: "João Silva Santos",
      cpf: "123.456.789-01",
      role: "Garçom",
      status: "active",
      company: { name: "Restaurante Bella Vista" },
      picture_url: "https://i.pravatar.cc/150?img=1",
    },
    {
      id: "2",
      full_name: "Maria Oliveira Costa",
      cpf: "987.654.321-02",
      role: "Cozinheira",
      status: "active",
      company: { name: "Restaurante Bella Vista" },
      picture_url: "https://i.pravatar.cc/150?img=2",
    },
  ];

  // Simular delay da API
  await new Promise((resolve) => setTimeout(resolve, 300));

  return {
    data: {
      workers: {
        data: mockWorkersPerDay,
        meta: {
          current_page: parseInt(page || "1"),
          last_page: 1,
          per_page: 10,
          total: mockWorkersPerDay.length,
        },
      },
    },
  };
};

export const indexWorkersPerEventDayQueryOptions = (props: {
  eventId?: string;
  eventDayId?: string;
  page?: string;
  q?: string;
}) =>
  queryOptions({
    queryKey: ["workersPerEventDay", props],
    queryFn: () => getWorkersPerEventDay(props),
    refetchOnWindowFocus: false,
  });

export const useIndexWorkersPerEventDayQuery = (props: {
  eventId: string;
  eventDayId: string;
  pagination?: Pagination;
}) => {
  return useQuery(indexWorkersPerEventDayQueryOptions(props));
};

export const getReplacementsPErEventDay = async ({
  eventDayId,
  eventId,
  page,
  q,
}: {
  eventId: string;
  eventDayId: string;
  page?: string;
  q?: string;
}) => {
  // Mock data para demonstração
  const mockReplacements = [
    {
      id: "1",
      full_name: "Carlos Roberto Lima",
      cpf: "456.789.123-03",
      role: "Garçom Substituto",
      status: "active",
      company: { name: "Bar do Zé" },
      picture_url: "https://i.pravatar.cc/150?img=3",
    },
  ];

  // Simular delay da API
  await new Promise((resolve) => setTimeout(resolve, 300));

  return {
    data: {
      replacements: {
        data: mockReplacements,
        meta: {
          current_page: parseInt(page || "1"),
          last_page: 1,
          per_page: 10,
          total: mockReplacements.length,
        },
      },
    },
  };
};

export const indexReplacementsPerEventDayQueryOptions = (props: {
  eventId: string;
  eventDayId: string;
  page?: string;
  q?: string;
}) =>
  queryOptions({
    queryKey: ["replacementsPerEventDay", props],
    queryFn: () => getReplacementsPErEventDay(props),
    refetchOnWindowFocus: false,
  });

export const useIndexReplacementsPerEventDayQuery = (props: {
  eventId: string;
  eventDayId: string;
  pagination?: Pagination;
}) => {
  return useQuery(indexReplacementsPerEventDayQueryOptions(props));
};

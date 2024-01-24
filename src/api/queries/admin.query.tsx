import { queryOptions, useQuery } from "@tanstack/react-query";
import { api } from "../api";
import { Pagination } from "@/utils/types";

export const getAdmins = async (pagination?: Pagination) => {
    const path = "/admins";
    const queryParams = new URLSearchParams({
        q: pagination?.q || "", // Use empty string if q is not provided
        page: pagination?.page || "1", // Use empty string if page is not provided
    });
    const url = `${path}?${queryParams.toString()}`;
    return await api.get(url);
};

export const indexAdminsQueryOption = (pagination?: Pagination) =>
    queryOptions({
        queryKey: ["admins", pagination],
        queryFn: () => getAdmins(pagination),
    });

export const useIndexAdmins = (pagination?: Pagination) => {
    return useQuery(indexAdminsQueryOption(pagination));
};

export const getSingleAdmin = async (id: string) => {
    return await api.get(`/admins/${id}`);
};

export const useSingleAdmin = (id: string) => {
    const admin = useQuery({ queryKey: ["adminDetail", id], queryFn: () => getSingleAdmin(id) });

    return { admin };
};

import axios from "axios";
axios.defaults.baseURL = "/";
axios.defaults.validateStatus = () => true;

export interface Pagination {
    skip: number;
    limit: number;
    hasNext: boolean;
}

export enum SortOrder {
    Asc = "asc",
    Desc = "desc",
}

interface SortQuery {
    key: string;
    order: SortOrder;
}
export const transformSortQuery = (query: SortQuery[]): string => {
    return JSON.stringify(query);
};

import { CreateItemResponseDTO, GetItemSpecResponseDTO } from "@/generated";
import { InventoryApi } from "@/generated";
import { SortOrder, transformSortQuery, type Pagination } from "@/utils/axios";
import type { ItemFilter } from "../stores/itemListingStore";

/** Store slice required by the item listing service */
export interface ItemListingStoreInput {
    getState: () => {
        filters: ItemFilter;
        pagination: Pagination;
        setItems: (items: CreateItemResponseDTO[]) => void;
        appendItems: (items: CreateItemResponseDTO[]) => void;
        setPagination: (pagination: Pagination) => void;
        setItemSpecs: (itemSpecs: GetItemSpecResponseDTO) => void;
        setLoading: (loading: boolean) => void;
    };
}

const PAGE_SIZE = 20;

/** Default sort: newest first by createdAt */
const DEFAULT_SORT = [{ key: "createdAt", order: SortOrder.Desc }];

function buildQueryFromFilters(filters: ItemFilter): object {
    const q: Record<string, unknown> = {};
    if (filters.name != null && String(filters.name).trim()) q.name = { match: filters.name.trim() };
    if (filters.description != null && String(filters.description).trim()) q.description = { match: filters.description.trim() };
    if (filters.category != null) q.category = { eq: filters.category };
    if (filters.server != null) q.server = { eq: filters.server };
    if (filters.slot != null) q.slot = { eq: filters.slot };
    if (filters.weaponType != null) q.weaponType = { eq: filters.weaponType };
    if (filters.element != null) q.element = { eq: filters.element };
    if (filters.gender != null) q.gender = { eq: filters.gender };
    if (filters.level != null) q.level = { gte: filters.level };
    if (filters.stats?.length) {
        const statsQuery: Record<string, { gte: number }> = {};
        filters.stats.forEach(({ code, value }) => {
            statsQuery[code] = { gte: value };
        });
        q.stats = statsQuery;
    }
    return q;
}

export function createItemListingService(store: ItemListingStoreInput) {
    const api = new InventoryApi();

    return {
        buildQueryFromFilters,

        /** Fetch items and update store. When skip > 0, appends to existing items. */
        async fetchItems(skip = 0): Promise<void> {
            const state = store.getState();
            state.setLoading(true);

            try {
                const queryObj = buildQueryFromFilters(state.filters);
                const { data } = await api.inventoryControllerGetItemsV1({
                    sort: transformSortQuery(DEFAULT_SORT),
                    query: JSON.stringify(queryObj),
                    skip,
                    limit: PAGE_SIZE,
                });

                if (!data?.data) return;

                if (skip === 0) {
                    state.setItems(data.data.items);
                } else {
                    state.appendItems(data.data.items);
                }
                state.setPagination({
                    skip: data.data.skip,
                    limit: data.data.limit,
                    hasNext: data.data.hasNext,
                });
            } finally {
                state.setLoading(false);
            }
        },

        /** Load next page using current filters and pagination from store */
        async loadMore(): Promise<void> {
            const state = store.getState();
            const { pagination } = state;
            await this.fetchItems(pagination.skip + pagination.limit);
        },

        /** Fetch item specs and update store */
        async fetchItemSpecs(): Promise<void> {
            const { data } = await api.inventoryControllerGetItemSpecsV1();
            if (!data?.data) return;
            store.getState().setItemSpecs(data.data);
        },
    };
}

export type ItemListingService = ReturnType<typeof createItemListingService>;

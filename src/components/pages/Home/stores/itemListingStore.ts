import {
    Category,
    CreateItemResponseDTO,
    Element,
    GameServer,
    Gender,
    GetItemSpecResponseDTO,
    Slot,
    WeaponType,
} from "@/generated";
import { Pagination } from "@/utils/axios";
import { create } from "zustand";

export interface ItemFilter {
    name?: string | null;
    description?: string | null;
    category?: Category | null;
    server?: GameServer | null;
    level?: number | null;
    stats?: Array<{ code: string; value: number }> | null;
    slot?: Slot | null;
    weaponType?: WeaponType | null;
    element?: Element | null;
    gender?: Gender | null;
}

type State = {
    filters: ItemFilter;
    items: CreateItemResponseDTO[];
    pagination: Pagination;
    itemSpecs: GetItemSpecResponseDTO;
    loading: boolean;
};

type Action = {
    setFilters: (filters: ItemFilter) => void;
    setItems: (items: CreateItemResponseDTO[]) => void;
    appendItems: (items: CreateItemResponseDTO[]) => void;
    setPagination: (pagination: Pagination) => void;
    setItemSpecs: (itemSpecs: GetItemSpecResponseDTO) => void;
    setLoading: (loading: boolean) => void;
};

export const useItemListingStore = create<State & Action>((set) => ({
    filters: {
        name: undefined,
        description: undefined,
        category: undefined,
        server: undefined,
        level: undefined,
        stats: undefined,
        slot: undefined,
        weaponType: undefined,
        element: undefined,
        gender: undefined,
    },
    setFilters: (filters: ItemFilter) =>
        set((state) => ({ ...state, filters })),

    items: [],
    setItems: (items: CreateItemResponseDTO[]) => set({ items }),
    appendItems: (items: CreateItemResponseDTO[]) =>
        set((state) => ({ items: [...state.items, ...items] })),

    itemSpecs: {
        server: [],
        category: [],
        slot: [],
        weaponType: [],
        element: [],
        stat: [],
        currency: [],
        gender: [],
    },
    setItemSpecs: (itemSpecs: GetItemSpecResponseDTO) => set({ itemSpecs }),

    pagination: {
        skip: 0,
        limit: 20,
        hasNext: false,
    },
    setPagination: (pagination: Pagination) => set({ pagination }),

    loading: false,
    setLoading: (loading: boolean) => set({ loading }),
}));

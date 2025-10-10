import type { Item } from "@/app/shared/models/data.model";

export interface AvailableItemsState {
  items: Item[];
  loading: boolean;
  error: string | null;
  loaded: boolean;
}

export const initialState: AvailableItemsState = {
  items: [],
  loading: false,
  error: null,
  loaded: false,
};

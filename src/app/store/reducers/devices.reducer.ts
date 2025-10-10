import { createFeature, createReducer, on } from "@ngrx/store";
import type { AvailableItemsState } from "@/app/store/state/devices.state";
import { initialState } from "@/app/store/state/devices.state";

import { AvailableItemsActions as D } from "@/app/store/actions/devices.actions";

export const AVAILABLE_ITEMS_FEATURE_KEY = "availableItems";

const reducer = createReducer(
  initialState,

  on(
    D.load,
    (state): AvailableItemsState => ({
      ...state,
      loading: true,
      error: null,
    }),
  ),

  on(
    D.loadSuccess,
    (state, { devices }): AvailableItemsState => ({
      ...state,
      loading: false,
      error: null,
      items: devices,
      loaded: true,
    }),
  ),

  on(
    D.loadFailure,
    (state, { error }): AvailableItemsState => ({
      ...state,
      loading: false,
      error,
    }),
  ),
);

export const availableItemsFeature = createFeature({
  name: "availableItems",
  reducer,
});

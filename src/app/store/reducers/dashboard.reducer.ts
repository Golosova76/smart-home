import { createFeature, createReducer, on } from "@ngrx/store";
import type { SelectedDashboardState } from "@/app/store/state/dashboard.state";
import { initialState } from "@/app/store/state/dashboard.state";
import * as A from "@/app/store/actions/dashboard.actions";

import * as Mut from "@/app/shared/utils/selected-dashboard";

import * as MutCard from "@/app/shared/utils/selected-dashboard-card";
import {
  DevicesActions,
  TabActionsTitleMove,
} from "@/app/store/actions/dashboard.actions";
import { setDeviceStateById } from "@/app/shared/utils/selected-dashboard-card";
import { AvailableItemsActions } from "@/app/store/actions/devices.actions";
import type { DataModel } from "@/app/shared/models/data.model";

export const SELECTED_DASHBOARD_FEATURE_KEY = "selectedDashboard";

export const reducer = createReducer<SelectedDashboardState>(
  initialState,

  on(
    A.selectDashboard,
    (
      state: SelectedDashboardState,
      { dashboardId },
    ): SelectedDashboardState => ({
      ...state,
      dashboardId,
      loading: true,
      initialized: false,
      error: null,
      editMode: false,
      deepCopy: null,
    }),
  ),

  on(
    A.loadSelectedDashboardSuccess,
    (state, { data }): SelectedDashboardState => ({
      ...state,
      loading: false,
      initialized: true,
      error: null,
      workingCopy: data,
    }),
  ),

  on(
    A.loadSelectedDashboardFailure,
    (state, { error }): SelectedDashboardState => ({
      ...state,
      loading: false,
      initialized: true,
      error,
    }),
  ),

  on(A.enterEditMode, (state): SelectedDashboardState => {
    const deepCopy = state.workingCopy
      ? structuredClone(state.workingCopy)
      : null;

    return {
      ...state,
      editMode: true,
      deepCopy,
      error: null,
    };
  }),

  on(
    A.exitEditMode,
    (state: SelectedDashboardState): SelectedDashboardState => ({
      ...state,
      editMode: false,
      deepCopy: null,
    }),
  ),

  on(
    A.saveDashboard,
    (state): SelectedDashboardState => ({
      ...state,
      loading: true,
      error: null,
    }),
  ),

  on(
    A.saveSelectedDashboardSuccess,
    (state, { data }): SelectedDashboardState => ({
      ...state,
      loading: false,
      editMode: false,
      deepCopy: null,
      workingCopy: data,
      error: null,
    }),
  ),

  on(
    A.saveSelectedDashboardFailure,
    (state, { error }): SelectedDashboardState => ({
      ...state,
      loading: false,
      error,
    }),
  ),

  on(
    A.discardChanges,
    (state): SelectedDashboardState => ({
      ...state,
      editMode: false,
      deepCopy: null,
      loading: false,
      workingCopy: state.deepCopy
        ? structuredClone(state.deepCopy)
        : state.workingCopy,
      error: null,
    }),
  ),

  on(
    A.TabActionsTitleMove.startTitleEdit,
    (state, { tabId, currentTitle }): SelectedDashboardState => ({
      ...state,
      editTabId: tabId,
      tabTitleDraft: currentTitle ?? "",
      error: null,
    }),
  ),

  on(
    A.TabActionsTitleMove.commitTitleEdit,
    (state, { tabId, newTitle }): SelectedDashboardState => {
      const { next, error } = Mut.produceWorkingCopy(
        state.workingCopy,
        (draft: DataModel): string | null =>
          Mut.mutateCommitTitleEdit(draft, { tabId, newTitle }),
      );

      if (error !== null && error !== undefined && error !== "") {
        return {
          ...state,
          workingCopy: state.workingCopy,
          error,
        };
      }

      return {
        ...state,
        workingCopy: next,
        error: null,
        editTabId: null,
        tabTitleDraft: "",
      };
    },
  ),

  on(
    A.TabActionsTitleMove.endTitleEdit,
    (state): SelectedDashboardState => ({
      ...state,
      editTabId: null,
      tabTitleDraft: "",
      error: null,
    }),
  ),

  on(
    A.TabActionsTitleMove.reorderTab,
    (state, { tabId, direction }): SelectedDashboardState => {
      const { next, error } = Mut.produceWorkingCopy(
        state.workingCopy,
        (draft) => Mut.mutateReorderTab(draft, { tabId, direction }),
      );
      return {
        ...state,
        workingCopy: next,
        error,
      };
    },
  ),

  on(
    A.TabActionsTitleMove.addTab,
    (state, { title }): SelectedDashboardState => {
      const { next, error } = Mut.produceWorkingCopy(
        state.workingCopy,
        (draft) => Mut.mutateAddTab(draft, { title }),
      );
      return {
        ...state,
        workingCopy: next,
        error,
      };
    },
  ),

  on(
    A.TabActionsTitleMove.removeTab,
    (state, { tabId }): SelectedDashboardState => {
      const { next, error } = Mut.produceWorkingCopy(
        state.workingCopy,
        (draft: DataModel): string | null =>
          Mut.mutateRemoveTab(draft, { tabId }),
      );

      if (
        (error === null || error === undefined || error === "") &&
        state.editTabId === tabId
      ) {
        return {
          ...state,
          workingCopy: next,
          error: null,
          editTabId: null,
          tabTitleDraft: "",
        };
      }

      return {
        ...state,
        workingCopy: next,
        error,
      };
    },
  ),

  on(
    A.TabActionsTitleMove.addCard,
    (state, { tabId, layout, title }): SelectedDashboardState => {
      const { next, error } = Mut.produceWorkingCopy(
        state.workingCopy,
        (draft) => MutCard.mutateAddCard(draft, { tabId, layout, title }),
      );
      return { ...state, workingCopy: next, error };
    },
  ),

  on(
    A.TabActionsTitleMove.reorderCard,
    (state, { tabId, cardId, newIndex }): SelectedDashboardState => {
      const { next, error } = Mut.produceWorkingCopy(
        state.workingCopy,
        (draft) =>
          MutCard.mutateReorderCard(draft, { tabId, cardId, newIndex }),
      );
      return { ...state, workingCopy: next, error };
    },
  ),

  on(
    A.TabActionsTitleMove.removeCard,
    (state, { tabId, cardId }): SelectedDashboardState => {
      const { next, error } = Mut.produceWorkingCopy(
        state.workingCopy,
        (draft) => MutCard.mutateRemoveCard(draft, { tabId, cardId }),
      );
      return { ...state, workingCopy: next, error };
    },
  ),

  on(
    TabActionsTitleMove.addItemToCard,
    (state, { tabId, cardId, item }): SelectedDashboardState => {
      if (!state.workingCopy) return state;

      const next = structuredClone(state.workingCopy);
      const tab = next.tabs.find((t) => t.id === tabId);
      const card = tab?.cards.find((c) => c.id === cardId);
      if (!card) return state;

      // Дубли разрешены — просто добавляем в конец
      card.items = [...card.items, item];

      return { ...state, workingCopy: next };
    },
  ),

  on(
    AvailableItemsActions.updateCardItems,
    (state, { tabId, cardId, items }): SelectedDashboardState => {
      if (!state.workingCopy) return state;

      const next = structuredClone(state.workingCopy);
      const tab = next.tabs.find((t) => t.id === tabId);
      const card = tab?.cards.find((c) => c.id === cardId);
      if (!card) return state;

      // Дубли разрешены — аппенд пачки
      card.items = [...card.items, ...items];

      return { ...state, workingCopy: next };
    },
  ),

  on(
    A.TabActionsTitleMove.removeItemFromCard,
    (state, { tabId, cardId, itemId }): SelectedDashboardState => {
      if (!state.workingCopy) return state;

      const next = structuredClone(state.workingCopy);

      const card = next.tabs
        .find((t) => t.id === tabId)
        ?.cards.find((c) => c.id === cardId);

      if (!card) return state;

      const items = card.items ?? [];
      const exists = items.some((item) => item.id === itemId);
      if (!exists) return state;

      card.items = items.filter((item) => item.id !== itemId);

      return { ...state, workingCopy: next };
    },
  ),

  on(
    DevicesActions.toggleDeviceStateSuccess,
    (state, { deviceId, state: confirmed }): SelectedDashboardState => {
      if (!state.workingCopy) return state;
      return {
        ...state,
        workingCopy: setDeviceStateById(state.workingCopy, deviceId, confirmed),
      };
    },
  ),
);

export const selectedDashboardFeature = createFeature({
  name: SELECTED_DASHBOARD_FEATURE_KEY,
  reducer,
});

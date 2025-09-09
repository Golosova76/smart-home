import { createFeature, createReducer, on } from '@ngrx/store';
import {
  initialState,
  SelectedDashboardState,
} from '@/app/store/state/dashboard.state';
import * as A from '@/app/store/actions/dashboard.actions';
import { DataModel } from '@/app/shared/models/data.model';

import * as Mut from '@/app/shared/utils/selected-dashboard';

import * as MutCard from '@/app/shared/utils/selected-dashboard-card';
import {
  DevicesActions,
  TabActionsTitleMove,
} from '@/app/store/actions/dashboard.actions';
import { setDeviceStateById } from '@/app/shared/utils/selected-dashboard-card';

export const SELECTED_DASHBOARD_FEATURE_KEY = 'selectedDashboard';

export const reducer = createReducer<SelectedDashboardState>(
  initialState,

  on(
    A.selectDashboard,
    (state, { dashboardId }): SelectedDashboardState => ({
      ...state,
      dashboardId,
      loading: true,
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
      error: null,
      workingCopy: data,
    }),
  ),

  on(
    A.loadSelectedDashboardFailure,
    (state, { error }): SelectedDashboardState => ({
      ...state,
      loading: false,
      error,
    }),
  ),

  on(A.enterEditMode, (state) => {
    const deepCopy = state.workingCopy
      ? (structuredClone(state.workingCopy) as DataModel)
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
    (state): SelectedDashboardState => ({
      ...state,
      editMode: false,
      deepCopy: null,
    }),
  ),

  on(A.saveDashboard, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(A.saveSelectedDashboardSuccess, (state, { data }) => ({
    ...state,
    loading: false,
    editMode: false,
    deepCopy: null,
    workingCopy: data,
    error: null,
  })),

  on(A.saveSelectedDashboardFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(A.discardChanges, (state) => ({
    ...state,
    editMode: false,
    deepCopy: null,
    loading: false,
    workingCopy: state.deepCopy
      ? (structuredClone(state.deepCopy) as DataModel)
      : state.workingCopy,
    error: null,
  })),

  on(
    A.TabActionsTitleMove.startTitleEdit,
    (state, { tabId, currentTitle }) => ({
      ...state,
      editTabId: tabId,
      tabTitleDraft: currentTitle ?? '',
      error: null,
    }),
  ),

  on(A.TabActionsTitleMove.commitTitleEdit, (state, { tabId, newTitle }) => {
    const { next, error } = Mut.produceWorkingCopy(state.workingCopy, (draft) =>
      Mut.mutateCommitTitleEdit(draft, { tabId, newTitle }),
    );

    if (error) {
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
      tabTitleDraft: '',
    };
  }),

  on(A.TabActionsTitleMove.endTitleEdit, (state) => ({
    ...state,
    editTabId: null,
    tabTitleDraft: '',
    error: null,
  })),

  on(A.TabActionsTitleMove.reorderTab, (state, { tabId, direction }) => {
    const { next, error } = Mut.produceWorkingCopy(state.workingCopy, (draft) =>
      Mut.mutateReorderTab(draft, { tabId, direction }),
    );
    return {
      ...state,
      workingCopy: next,
      error,
    };
  }),

  on(A.TabActionsTitleMove.addTab, (state, { title }) => {
    const { next, error } = Mut.produceWorkingCopy(state.workingCopy, (draft) =>
      Mut.mutateAddTab(draft, { title }),
    );
    return {
      ...state,
      workingCopy: next,
      error,
    };
  }),

  on(A.TabActionsTitleMove.removeTab, (state, { tabId }) => {
    const { next, error } = Mut.produceWorkingCopy(state.workingCopy, (draft) =>
      Mut.mutateRemoveTab(draft, { tabId }),
    );

    if (!error && state.editTabId === tabId) {
      return {
        ...state,
        workingCopy: next,
        error: null,
        editTabId: null,
        tabTitleDraft: '',
      };
    }
    return {
      ...state,
      workingCopy: next,
      error,
    };
  }),

  on(A.TabActionsTitleMove.addCard, (state, { tabId, layout, title }) => {
    const { next, error } = Mut.produceWorkingCopy(state.workingCopy, (draft) =>
      MutCard.mutateAddCard(draft, { tabId, layout, title }),
    );
    return { ...state, workingCopy: next, error };
  }),

  on(
    A.TabActionsTitleMove.startCardTitleEdit,
    (state, { tabId, cardId, currentTitle }) => ({
      ...state,
      editCard: { tabId, cardId },
      cardTitleDraft: currentTitle,
      error: null,
    }),
  ),

  on(
    A.TabActionsTitleMove.commitCardTitleEdit,
    (state, { tabId, cardId, newTitle }) => {
      const { next, error } = Mut.produceWorkingCopy(
        state.workingCopy,
        (draft) =>
          MutCard.mutateCommitCardTitleEdit(draft, { tabId, cardId, newTitle }),
      );

      if (error) {
        return { ...state, error };
      }

      return {
        ...state,
        workingCopy: next,
        error: null,
        editCard: null,
        cardTitleDraft: '',
      };
    },
  ),

  on(A.TabActionsTitleMove.endCardTitleEdit, (state) => ({
    ...state,
    editCard: null,
    cardTitleDraft: '',
  })),

  on(
    A.TabActionsTitleMove.reorderCard,
    (state, { tabId, cardId, newIndex }) => {
      const { next, error } = Mut.produceWorkingCopy(
        state.workingCopy,
        (draft) =>
          MutCard.mutateReorderCard(draft, { tabId, cardId, newIndex }),
      );
      return { ...state, workingCopy: next, error };
    },
  ),

  on(A.TabActionsTitleMove.removeCard, (state, { tabId, cardId }) => {
    const { next, error } = Mut.produceWorkingCopy(state.workingCopy, (draft) =>
      MutCard.mutateRemoveCard(draft, { tabId, cardId }),
    );
    return { ...state, workingCopy: next, error };
  }),

  on(TabActionsTitleMove.addItemToCard, (state, { tabId, cardId, item }) => {
    if (!state.workingCopy) return state;

    const next = structuredClone(state.workingCopy);
    const card = next.tabs
      .find((tab) => tab.id === tabId)
      ?.cards.find((card) => card.id === cardId);
    if (!card) return state;

    const exists = card.items?.some((item) => item.id === item.id);
    if (!exists) {
      card.items = [...(card.items ?? []), item];
    }

    return { ...state, workingCopy: next };
  }),

  on(
    A.TabActionsTitleMove.removeItemFromCard,
    (state, { tabId, cardId, itemId }) => {
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
    (state, { deviceId, state: confirmed }) => {
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

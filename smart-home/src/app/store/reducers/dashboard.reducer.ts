import { createFeature, createReducer, on } from '@ngrx/store';
import {
  initialState,
  SelectedDashboardState,
} from '@/app/store/state/dashboard.state';
import * as A from '@/app/store/actions/dashboard.actions';
import { DataModel } from '@/app/shared/models/data.model';

import * as Mut from '@/app/shared/utils/selected-dashboard';

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
);

export const selectedDashboardFeature = createFeature({
  name: SELECTED_DASHBOARD_FEATURE_KEY,
  reducer,
});



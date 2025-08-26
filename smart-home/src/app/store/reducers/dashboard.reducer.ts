import {createFeature, createReducer, on} from '@ngrx/store';
import {initialState, SelectedDashboardState} from '@/app/store/state/dashboard.state';
import * as A from '@/app/store/actions/dashboard.actions'


export const SELECTED_DASHBOARD_FEATURE_KEY = 'selectedDashboard';

export const reducer = createReducer<SelectedDashboardState>(
  initialState,

  on(A.selectDashboard, (state, { dashboardId }): SelectedDashboardState => ({
    ...state,
    dashboardId,
    loading: true,
    error: null,
    editMode: false,
    deepCopy: null,
  })),

  on(A.loadSelectedDashboardSuccess, (state, { data }): SelectedDashboardState => ({
    ...state,
    loading: false,
    error: null,
    workingCopy: data,
  })),

  on(A.loadSelectedDashboardFailure, (state, { error }): SelectedDashboardState => ({
    ...state,
    loading: false,
    error,
  })),
)

export const selectedDashboardFeature = createFeature({
  name: SELECTED_DASHBOARD_FEATURE_KEY,
  reducer,
});



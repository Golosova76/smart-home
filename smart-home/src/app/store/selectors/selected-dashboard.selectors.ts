import { createSelector } from '@ngrx/store';
import { selectedDashboardFeature } from '@/app/store/reducers/dashboard.reducer';

// весь срез состояния фичи
export const selectFeatureState =
  selectedDashboardFeature.selectSelectedDashboardState;

// по полям верхнего уровня стейта
export const selectDashboardId = selectedDashboardFeature.selectDashboardId;

export const selectIsEditModeEnabled = selectedDashboardFeature.selectEditMode;

export const selectDeepCopy = selectedDashboardFeature.selectDeepCopy;

export const selectWorkingCopy = selectedDashboardFeature.selectWorkingCopy;

export const selectIsLoading = selectedDashboardFeature.selectLoading;

export const selectError = selectedDashboardFeature.selectError;

export const selectEditTabId = selectedDashboardFeature.selectEditTabId;

export const selectTabTitleDraft = selectedDashboardFeature.selectTabTitleDraft;

export const selectTabs = createSelector(
  selectWorkingCopy,
  (working) => working?.tabs ?? [],
);

export const selectCardsByTabId = (tabId: string | null) =>
  createSelector(selectTabs, (tabs) =>
    tabId ? (tabs.find((tab) => tab.id === tabId)?.cards ?? []) : [],
  );

export const selectIsDeleteDisabled = createSelector(
  selectIsEditModeEnabled,
  (edit) => edit,
);

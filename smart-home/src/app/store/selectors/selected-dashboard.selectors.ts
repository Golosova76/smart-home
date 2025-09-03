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

// возвращает card[] нужного таба или []
export const selectCardsByTabId = (tabId: string | null) =>
  createSelector(selectTabs, (tabs) =>
    tabId ? (tabs.find((tab) => tab.id === tabId)?.cards ?? []) : [],
  );

// по tabId и cardId возвращает одну конкретную карточку или null
export const selectCardById = (tabId: string | null, cardId: string | null) =>
  createSelector(selectCardsByTabId(tabId), (cards) =>
    cardId ? cards.find((card) => card.id === cardId) ?? null : null,
  );

export const selectEditCard = selectedDashboardFeature.selectEditCard;
export const selectCardTitleDraft = selectedDashboardFeature.selectCardTitleDraft;

export const selectCardIndex = (tabId: string, cardId: string) =>
  createSelector(selectCardsByTabId(tabId), (cards) =>
    cards.findIndex((card) => card.id === cardId),
  );

export const selectCanMoveCardLeft = (tabId: string, cardId: string) =>
  createSelector(selectCardIndex(tabId, cardId), selectCardsByTabId(tabId),
    (index, cards) => index > 0 && index < cards.length);

export const selectCanMoveCardRight = (tabId: string, cardId: string) =>
  createSelector(selectCardIndex(tabId, cardId), selectCardsByTabId(tabId),
    (index, cards) => index >= 0 && index < cards.length - 1);

export const selectIsDeleteDisabled = createSelector(
  selectIsEditModeEnabled,
  (edit) => edit,
);

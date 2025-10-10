import type { MemoizedSelector } from "@ngrx/store";
import { createSelector } from "@ngrx/store";
import { selectedDashboardFeature } from "@/app/store/reducers/dashboard.reducer";
import type { Card } from "@/app/shared/models/data.model";

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
export const selectCardsByTabId = (
  tabId: string | null,
): MemoizedSelector<object, Card[]> =>
  createSelector(selectTabs, (tabs): Card[] =>
    tabId !== null && tabId !== undefined && tabId !== ""
      ? (tabs.find((tab) => tab.id === tabId)?.cards ?? [])
      : [],
  );

// по tabId и cardId возвращает одну конкретную карточку или null
export const selectCardById = (
  tabId: string | null,
  cardId: string | null,
): MemoizedSelector<object, Card | null> =>
  createSelector(selectCardsByTabId(tabId), (cards) =>
    cardId !== null && cardId !== undefined && cardId !== ""
      ? (cards.find((card) => card.id === cardId) ?? null)
      : null,
  );

export const selectEditCard = selectedDashboardFeature.selectEditCard;
export const selectCardTitleDraft =
  selectedDashboardFeature.selectCardTitleDraft;

export const selectCardIndex = (
  tabId: string,
  cardId: string,
): MemoizedSelector<object, number> =>
  createSelector(selectCardsByTabId(tabId), (cards) =>
    cards.findIndex((card) => card.id === cardId),
  );

export const selectCanMoveCardLeft = (
  tabId: string,
  cardId: string,
): MemoizedSelector<object, boolean> =>
  createSelector(
    selectCardIndex(tabId, cardId),
    selectCardsByTabId(tabId),
    (index, cards) => index > 0 && index < cards.length,
  );

export const selectCanMoveCardRight = (
  tabId: string,
  cardId: string,
): MemoizedSelector<object, boolean> =>
  createSelector(
    selectCardIndex(tabId, cardId),
    selectCardsByTabId(tabId),
    (index, cards) => index >= 0 && index < cards.length - 1,
  );

export const selectIsDeleteDisabled = createSelector(
  selectIsEditModeEnabled,
  (edit) => edit,
);

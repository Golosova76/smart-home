import { createAction, props } from '@ngrx/store';
import { DeviceItem, SensorItem } from '@/app/shared/models/data.model';

export const addCard = createAction(
  '[Card] Add Card',
  props<{ tabId: string; layout: string }>(),
);

export const removeCard = createAction(
  '[Card] Remove Card',
  props<{ tabId: string; cardId: string }>(),
);

export const reorderCard = createAction(
  '[Card] Reorder Card',
  props<{ tabId: string; cardId: string; newIndex: number }>(),
);

export const addItemToCard = createAction(
  '[Card] Add Item To Card',
  props<{ tabId: string; cardId: string; item: DeviceItem | SensorItem }>(), // or Device without type??
);

export const removeItemFromCard = createAction(
  '[Card] Remove Item From Card',
  props<{ tabId: string; cardId: string; itemId: string }>(),
);

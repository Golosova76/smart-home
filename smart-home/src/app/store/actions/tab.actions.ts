import { createAction, props } from '@ngrx/store';

export const addTab = createAction('[Tab] Add Tab', props<{ title: string }>());

export const removeTab = createAction(
  '[Tab] Remove Tab',
  props<{ tabId: string }>(),
);

export const reorderTab = createAction(
  '[Tab] Reorder Tab',
  props<{ tabId: string; direction: 'left' | 'right' }>(),
);

import {
  createAction,
  createActionGroup,
  emptyProps,
  props,
} from '@ngrx/store';
import {DataModel, LayoutType} from '@/app/shared/models/data.model';

export const selectDashboard = createAction(
  '[SelectedDashboard] Select Dashboard',
  props<{ dashboardId: string }>(),
);

export const loadSelectedDashboardSuccess = createAction(
  '[SelectedDashboard/API] Load Success Dashboard',
  props<{ data: DataModel }>(),
);

export const loadSelectedDashboardFailure = createAction(
  '[SelectedDashboard/API] Load Failure Dashboard',
  props<{ error: string }>(),
);

export const enterEditMode = createAction('[Dashboard] Enter Edit Mode');

export const exitEditMode = createAction('[Dashboard] Exit Edit Mode');

export const saveDashboard = createAction('[Dashboard] Save Dashboard');

export const discardChanges = createAction('[Dashboard] Discard Changes');

export const saveSelectedDashboardSuccess = createAction(
  '[SelectedDashboard/API] Save Success SelectedDashboard',
  props<{ data: DataModel }>(),
);

export const saveSelectedDashboardFailure = createAction(
  '[SelectedDashboard/API] Save Failure SelectedDashboard',
  props<{ error: string }>(),
);

export const TabActionsTitleMove = createActionGroup({
  source: 'SelectedDashboard/TabsTitle',
  events: {
    'Add Tab': props<{ title: string }>(),
    'Remove Tab': props<{ tabId: string }>(),

    'Reorder Tab': props<{ tabId: string; direction: 'left' | 'right' }>(),

    'Start Title Edit': props<{ tabId: string; currentTitle: string }>(),
    'Commit Title Edit': props<{ tabId: string; newTitle: string }>(),
    'End Title Edit': emptyProps(),

    'Add Card': props<{ tabId: string; layout: LayoutType; title: string }>(),
    'Remove Card': props<{ tabId: string; cardId: string }>(),
    'Reorder Card': props<{ tabId: string; cardId: string; newIndex: number }>(),

    'Start Card Title Edit': props<{ tabId: string; cardId: string; currentTitle: string }>(),
    'Commit Card Title Edit': props<{ tabId: string; cardId: string; newTitle: string }>(),
    'End Card Title Edit': emptyProps(),
  },
});

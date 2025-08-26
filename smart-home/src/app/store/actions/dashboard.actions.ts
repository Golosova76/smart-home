import { createAction } from '@ngrx/store';

export const enterEditMode = createAction('[Dashboard] Enter Edit Mode');

export const exitEditMode = createAction('[Dashboard] Exit Edit Mode');

export const saveDashboard = createAction('[Dashboard] Save Dashboard');

export const discardChanges = createAction('[Dashboard] Discard Changes');

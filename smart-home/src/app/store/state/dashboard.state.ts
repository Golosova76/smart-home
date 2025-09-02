import { DataModel } from '@/app/shared/models/data.model';

export interface SelectedDashboardState {
  dashboardId: string | null;
  editMode: boolean;
  deepCopy: DataModel | null;
  workingCopy: DataModel | null;
  loading: boolean;
  error: string | null;

  editTabId: string | null;
  tabTitleDraft: string;
}

export const initialState: SelectedDashboardState = {
  dashboardId: null,
  editMode: false,
  deepCopy: null,
  workingCopy: null,
  loading: false,
  error: null,

  editTabId: null,
  tabTitleDraft: '',
};

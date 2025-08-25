import {DashboardEditorState} from '@/app/shared/models/store.model';


export const initialState: DashboardEditorState = {
  editMode: false,
  deepCopy: null,
  workingCopy: null,
  hasChanges: false,
  saveStatus: 'idle'
};

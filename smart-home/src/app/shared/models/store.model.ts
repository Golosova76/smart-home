import {DataModel} from '@/app/shared/models/data.model';

export  interface DashboardEditorState {
  editMode: boolean;
  deepCopy: DataModel | null;
  workingCopy: DataModel | null;
  hasChanges: boolean;
  saveStatus: 'idle' | 'pending';
}

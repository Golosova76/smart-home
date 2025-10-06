import { SELECTED_DASHBOARD_FEATURE_KEY } from '@/app/store/reducers/dashboard.reducer';
import { SelectedDashboardState } from '@/app/store/state/dashboard.state';
import { AVAILABLE_ITEMS_FEATURE_KEY } from '@/app/store/reducers/devices.reducer';
import { AvailableItemsState } from '@/app/store/state/devices.state';

export interface AppState {
  [SELECTED_DASHBOARD_FEATURE_KEY]: SelectedDashboardState;
  [AVAILABLE_ITEMS_FEATURE_KEY]: AvailableItemsState;
}

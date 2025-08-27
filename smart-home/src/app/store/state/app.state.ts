import { SELECTED_DASHBOARD_FEATURE_KEY } from '@/app/store/reducers/dashboard.reducer';
import { SelectedDashboardState } from '@/app/store/state/dashboard.state';

export interface AppState {
  [SELECTED_DASHBOARD_FEATURE_KEY]: SelectedDashboardState;
  // сюда добавятся другие feature-срезы:
  // [DEVICES_FEATURE_KEY]: DevicesState;
  // [SENSORS_FEATURE_KEY]: SensorsState;
}

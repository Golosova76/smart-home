import type { SELECTED_DASHBOARD_FEATURE_KEY } from "@/app/store/reducers/dashboard.reducer";
import type { SelectedDashboardState } from "@/app/store/state/dashboard.state";
import type { AVAILABLE_ITEMS_FEATURE_KEY } from "@/app/store/reducers/devices.reducer";
import type { AvailableItemsState } from "@/app/store/state/devices.state";

export interface AppState {
  [SELECTED_DASHBOARD_FEATURE_KEY]: SelectedDashboardState;
  [AVAILABLE_ITEMS_FEATURE_KEY]: AvailableItemsState;
}

import { Component, computed, inject, input } from "@angular/core";

import type { Device, LayoutType } from "@/app/shared/models/data.model";
import { LAYOUT_TYPES } from "@/app/shared/models/data.model";
import { NgClass, NgTemplateOutlet } from "@angular/common";
import { LightActiveDeviceDirective } from "@/app/shared/directives/light-active-device.directive";
import { Store } from "@ngrx/store";
import type { AppState } from "@/app/store/state/app.state";
import { RouteIdValidService } from "@/app/shared/services/route-id-valid.service";
import {
  DevicesActions,
  TabActionsTitleMove,
} from "@/app/store/actions/dashboard.actions";
import * as dashboardsSelectors from "@/app/store/selectors/selected-dashboard.selectors";

@Component({
  selector: "app-device",
  standalone: true,
  imports: [NgClass, LightActiveDeviceDirective, NgTemplateOutlet],
  templateUrl: "./device.component.html",
  styleUrl: "./device.component.scss",
})
export class DeviceComponent {
  private store = inject<Store<AppState>>(Store);
  private readonly routeIds = inject(RouteIdValidService);
  readonly LAYOUT = LAYOUT_TYPES;

  device = input<Device>();
  layout = input<LayoutType>();
  readonly selectedTabId = this.routeIds.selectedTabId;
  cardId = input<string | null>(null);
  readonly isEditMode = this.store.selectSignal<boolean>(
    dashboardsSelectors.selectIsEditModeEnabled,
  );

  readonly isOn = computed(() => !!this.device()?.state);

  readonly toggleIcon = computed(() =>
    this.isOn() ? "toggle_on" : "toggle_off",
  );
  readonly toggleClasses = computed(() => ({
    on: this.isOn(),
    off: !this.isOn(),
  }));

  onItemDelete(): void {
    const tabId = this.selectedTabId();
    const cardId = this.cardId();
    const itemId = this.device()?.id;

    if (!tabId || !cardId || !itemId) return;

    this.store.dispatch(
      TabActionsTitleMove.removeItemFromCard({ tabId, cardId, itemId }),
    );
  }

  onToggleClick() {
    const device = this.device();
    if (!device) return;

    this.store.dispatch(
      DevicesActions.toggleDeviceState({
        deviceId: device.id,
        newState: !device.state,
      }),
    );
  }
}

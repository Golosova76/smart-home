import type { InputSignal, Signal } from "@angular/core";
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
import { isNullOrEmpty } from "@/app/shared/utils/is-null-or-empty";

@Component({
  selector: "app-device",
  standalone: true,
  imports: [NgClass, LightActiveDeviceDirective, NgTemplateOutlet],
  templateUrl: "./device.component.html",
  styleUrl: "./device.component.scss",
})
export class DeviceComponent {
  private readonly store: Store<AppState> = inject<Store<AppState>>(Store);
  private readonly routeIds: RouteIdValidService = inject(RouteIdValidService);
  public readonly LAYOUT = LAYOUT_TYPES;

  public readonly device: InputSignal<Device | undefined> = input<Device>();
  public readonly layout: InputSignal<LayoutType | undefined> =
    input<LayoutType>();
  public readonly selectedTabId: Signal<string | null> =
    this.routeIds.selectedTabId;
  public readonly cardId: InputSignal<string | null> = input<string | null>(
    null,
  );
  public readonly isEditMode: Signal<boolean> =
    this.store.selectSignal<boolean>(
      dashboardsSelectors.selectIsEditModeEnabled,
    );

  public readonly isOn: Signal<boolean> = computed((): boolean => {
    const device: Device | undefined = this.device();
    return device?.state === true;
  });

  public readonly toggleIcon = computed(() =>
    this.isOn() ? "toggle_on" : "toggle_off",
  );

  public readonly toggleClasses = computed(() => ({
    on: this.isOn(),
    off: !this.isOn(),
  }));

  public onItemDelete(): void {
    const tabId: string | null = this.selectedTabId();
    const cardId: string | null = this.cardId();
    const itemId: string | undefined = this.device()?.id;

    if (isNullOrEmpty(tabId) || isNullOrEmpty(cardId) || isNullOrEmpty(itemId))
      return;

    this.store.dispatch(
      TabActionsTitleMove.removeItemFromCard({ tabId, cardId, itemId }),
    );
  }

  public onToggleClick(): void {
    const device: Device | undefined = this.device();
    if (!device) return;

    this.store.dispatch(
      DevicesActions.toggleDeviceState({
        deviceId: device.id,
        newState: !device.state,
      }),
    );
  }
}

import { Component, inject, input } from "@angular/core";

import type { LayoutType, Sensor } from "@/app/shared/models/data.model";
import { LAYOUT_TYPES } from "@/app/shared/models/data.model";
import { SensorValuePipe } from "@/app/shared/pipes/sensor-value.pipe";
import { NgTemplateOutlet } from "@angular/common";
import * as dashboardsSelectors from "@/app/store/selectors/selected-dashboard.selectors";
import { Store } from "@ngrx/store";
import type { AppState } from "@/app/store/state/app.state";
import { RouteIdValidService } from "@/app/shared/services/route-id-valid.service";
import { TabActionsTitleMove } from "@/app/store/actions/dashboard.actions";

@Component({
  selector: "app-sensor",
  standalone: true,
  imports: [SensorValuePipe, NgTemplateOutlet],
  templateUrl: "./sensor.component.html",
  styleUrl: "./sensor.component.scss",
})
export class SensorComponent {
  private store = inject<Store<AppState>>(Store);
  private readonly routeIds = inject(RouteIdValidService);
  readonly LAYOUT = LAYOUT_TYPES;

  layout = input<LayoutType>();
  sensor = input<Sensor>();

  readonly selectedTabId = this.routeIds.selectedTabId;
  cardId = input<string | null>(null);
  readonly isEditMode = this.store.selectSignal<boolean>(
    dashboardsSelectors.selectIsEditModeEnabled,
  );

  onItemDelete(): void {
    const tabId = this.selectedTabId();
    const cardId = this.cardId();
    const itemId = this.sensor()?.id;

    if (!tabId || !cardId || !itemId) return;

    this.store.dispatch(
      TabActionsTitleMove.removeItemFromCard({ tabId, cardId, itemId }),
    );
  }
}

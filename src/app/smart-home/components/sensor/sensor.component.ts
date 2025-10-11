import type { InputSignal, Signal } from "@angular/core";
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
  private readonly store: Store<AppState> = inject<Store<AppState>>(Store);
  private readonly routeIds: RouteIdValidService =
    inject(RouteIdValidService);
 public readonly LAYOUT = LAYOUT_TYPES;

  public readonly layout: InputSignal<LayoutType | undefined> =
    input<LayoutType>();
  public readonly sensor: InputSignal<Sensor | undefined> = input<Sensor>();

  protected readonly selectedTabId: Signal<string | null> =
    this.routeIds.selectedTabId;
  public readonly cardId: InputSignal<string | null> = input<string | null>(
    null,
  );
  protected readonly isEditMode: Signal<boolean> =
    this.store.selectSignal<boolean>(
      dashboardsSelectors.selectIsEditModeEnabled,
    );

  public onItemDelete(): void {
    const tabId: string | null = this.selectedTabId();
    if (typeof tabId !== "string" || tabId.length === 0) return;

    const cardId: string | null = this.cardId();
    if (typeof cardId !== "string" || cardId.length === 0) return;

    const itemId: string | undefined = this.sensor()?.id;
    if (typeof itemId !== "string" || itemId.length === 0) return;

    this.store.dispatch(
      TabActionsTitleMove.removeItemFromCard({ tabId, cardId, itemId }),
    );
  }
}

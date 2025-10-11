import type { Signal, InputSignal, WritableSignal } from "@angular/core";
import { Component, computed, inject, input, signal } from "@angular/core";

import type {
  Card,
  Device,
  DeviceItem,
  Item,
  Sensor,
  SensorItem,
} from "@/app/shared/models/data.model";
import { ITEM_TYPES } from "@/app/shared/models/data.model";
import { NgClass } from "@angular/common";
import { SensorComponent } from "@/app/smart-home/components/sensor/sensor.component";
import { DeviceComponent } from "@/app/smart-home/components/device/device.component";

import { LightActiveCardDirective } from "@/app/shared/directives/light-active-card.directive";
import { Store } from "@ngrx/store";
import type { AppState } from "@/app/store/state/app.state";
import { RouteIdValidService } from "@/app/shared/services/route-id-valid.service";
import * as dashboardsSelectors from "@/app/store/selectors/selected-dashboard.selectors";
import * as devicesSelectors from "@/app/store/selectors/devices.selectors";
import { ModalEditCardComponent } from "@/app/smart-home/components/modal/modal-edit-card/modal-edit-card.component";
import {
  DevicesActions,
  TabActionsTitleMove,
} from "@/app/store/actions/dashboard.actions";
import { AvailableItemsActions } from "@/app/store/actions/devices.actions";
import {
  isNonEmptyString,
  isNullOrEmpty,
} from "@/app/shared/utils/is-null-or-empty";

@Component({
  selector: "app-card",
  standalone: true,
  imports: [
    NgClass,
    SensorComponent,
    DeviceComponent,
    LightActiveCardDirective,
    ModalEditCardComponent,
  ],
  templateUrl: "./card.component.html",
  styleUrl: "./card.component.scss",
})
export class CardComponent {
  private readonly store: Store<AppState> = inject<Store<AppState>>(Store);
  private readonly routeIds: RouteIdValidService = inject(RouteIdValidService);

  public readonly cardId: InputSignal<string | null> = input<string | null>(
    null,
  );

  private readonly selectedTabId: Signal<string | null> =
    this.routeIds.selectedTabId;

  public isEditCardOpenModal: WritableSignal<boolean> = signal(false);

  public readonly isEmptyCard: Signal<boolean> = computed((): boolean => {
    const items: Item[] | undefined = this.card()?.items;
    return !items || items.length === 0;
  });

  public readonly hasGroupToggle: Signal<boolean> = computed(
    (): boolean => (this.devices()?.length ?? 0) > 1,
  );
  public readonly disableLeft: Signal<boolean> = computed(
    (): boolean => this.cardIndex() <= 0,
  );
  public readonly disableRight: Signal<boolean> = computed(
    (): boolean =>
      this.cardsCount() <= 1 || this.cardIndex() === this.cardsCount() - 1,
  );

  public readonly groupIsOn: Signal<boolean> = computed<boolean>((): boolean =>
    this.devices().some((device: Device): boolean => device.state),
  );

  public readonly groupToggleIcon = computed(() =>
    this.groupIsOn() ? "toggle_on" : "toggle_off",
  );

  public readonly groupToggleClasses = computed(() => ({
    on: this.groupIsOn(),
    off: !this.groupIsOn(),
  }));

  public readonly isEditMode: Signal<boolean> =
    this.store.selectSignal<boolean>(
      dashboardsSelectors.selectIsEditModeEnabled,
    );

  public readonly card: Signal<Card | null> = computed((): Card | null => {
    const tabId: string | null = this.selectedTabId();
    const cardId: string | null = this.cardId();
    if (isNullOrEmpty(tabId) || isNullOrEmpty(cardId)) return null;

    const selectCardById = dashboardsSelectors.selectCardById(tabId, cardId);
    return this.store.selectSignal(selectCardById)();
  });

  public readonly sensors: Signal<Sensor[]> = computed<Sensor[]>(() =>
    (this.card()?.items ?? [])
      .filter(
        (item: Item): item is SensorItem => item.type === ITEM_TYPES.SENSOR,
      )
      .map(({ type, ...rest }: SensorItem) => rest),
  );

  public readonly devices: Signal<Device[]> = computed<Device[]>(() =>
    (this.card()?.items ?? [])
      .filter((item): item is DeviceItem => item.type === ITEM_TYPES.DEVICE)
      .map(({ type, ...rest }: DeviceItem) => rest),
  );

  public readonly cardsInTab: Signal<Card[]> = computed((): Card[] => {
    const tabId: string | null = this.selectedTabId();
    if (isNullOrEmpty(tabId)) return [];
    const sel = dashboardsSelectors.selectCardsByTabId(tabId);
    return this.store.selectSignal(sel)() ?? [];
  });

  public readonly cardIndex: Signal<number> = computed((): number => {
    const id: string | null = this.cardId();
    const list: Card[] = this.cardsInTab();
    return isNullOrEmpty(id)
      ? list.findIndex((card: Card): boolean => card.id === id)
      : -1;
  });

  public readonly cardsCount: Signal<number> = computed(
    (): number => this.cardsInTab().length,
  );

  public openEditCardModal(): void {
    this.isEditCardOpenModal.set(true);
  }

  public closeDelete(): void {
    this.isEditCardOpenModal.set(false);
  }

  public onCardEdit({
    deviceId,
    sensorId,
  }: {
    deviceId: string | null;
    sensorId: string | null;
  }): void {
    const tabId: string | null = this.selectedTabId();
    const cardId: string | null = this.cardId();
    if (isNullOrEmpty(tabId) || isNullOrEmpty(cardId)) return;

    const itemsToAdd: Item[] = [];

    if (isNonEmptyString(sensorId)) {
      const sensor = this.store.selectSignal(
        devicesSelectors.selectSensorById(sensorId),
      )();
      if (sensor) itemsToAdd.push(sensor); // sensor уже с type: 'sensor'
    }

    if (isNonEmptyString(deviceId)) {
      const device = this.store.selectSignal(
        devicesSelectors.selectDeviceById(deviceId),
      )();
      if (device) itemsToAdd.push(device); // device уже с type: 'device'
    }

    if (itemsToAdd.length > 0) {
      this.store.dispatch(
        AvailableItemsActions.updateCardItems({
          tabId,
          cardId,
          items: itemsToAdd,
        }),
      );
    }

    this.closeDelete();
  }

  public onCardDelete(): void {
    const tabId: string | null = this.selectedTabId();
    const cardId: string | null = this.cardId();
    if (isNullOrEmpty(tabId) || isNullOrEmpty(cardId)) return;

    this.store.dispatch(TabActionsTitleMove.removeCard({ tabId, cardId }));
  }

  public onReorderCard(targetIndex: number): void {
    const tabId: string | null = this.selectedTabId();
    const cardId: string | null = this.cardId();
    const from: number = this.cardIndex();
    const count: number = this.cardsCount();

    if (isNullOrEmpty(tabId) || isNullOrEmpty(cardId) || from < 0 || count <= 1)
      return;

    const max: number = count - 1;
    const newIndex: number = Math.max(0, Math.min(targetIndex, max));
    if (newIndex === from) return;

    this.store.dispatch(
      TabActionsTitleMove.reorderCard({ tabId, cardId, newIndex }),
    );
  }

  public moveLeft(): void {
    if (this.disableLeft()) return;
    this.onReorderCard(this.cardIndex() - 1);
  }

  public moveRight(): void {
    if (this.disableRight()) return;
    this.onReorderCard(this.cardIndex() + 1);
  }

  public onGroupToggleClick(): void {
    const next: boolean = !this.groupIsOn();
    for (const d of this.devices()) {
      this.store.dispatch(
        DevicesActions.toggleDeviceState({
          deviceId: d.id,
          newState: next,
        }),
      );
    }
  }
}

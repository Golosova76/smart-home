import { Component, computed, inject, input, signal } from '@angular/core';

import {
  Device,
  DeviceItem,
  ITEM_TYPES,
  Sensor,
  SensorItem,
} from '@/app/shared/models/data.model';
import { NgClass } from '@angular/common';
import { SensorComponent } from '@/app/smart-home/components/sensor/sensor.component';
import { DeviceComponent } from '@/app/smart-home/components/device/device.component';

import { LightActiveCardDirective } from '@/app/shared/directives/light-active-card.directive';
import { Store } from '@ngrx/store';
import { AppState } from '@/app/store/state/app.state';
import { RouteIdValidService } from '@/app/shared/services/route-id-valid.service';
import * as dashboardsSelectors from '@/app/store/selectors/selected-dashboard.selectors';
import * as devicesSelectors from '@/app/store/selectors/devices.selectors';
import { ModalEditCardComponent } from '@/app/smart-home/components/modal/modal-edit-card/modal-edit-card.component';
import {
  DevicesActions,
  TabActionsTitleMove,
} from '@/app/store/actions/dashboard.actions';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [
    NgClass,
    SensorComponent,
    DeviceComponent,
    LightActiveCardDirective,
    ModalEditCardComponent,
  ],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss',
})
export class CardComponent {
  private store = inject<Store<AppState>>(Store);
  private readonly routeIds = inject(RouteIdValidService);

  cardId = input<string | null>(null);

  readonly selectedTabId = this.routeIds.selectedTabId;

  readonly isEditCardOpenModal = signal(false);

  readonly isEmptyCard = computed(() => !this.card()?.items?.length);
  readonly hasGroupToggle = computed(() => (this.devices()?.length ?? 0) > 1);
  readonly disableLeft = computed(() => this.cardIndex() <= 0);
  readonly disableRight = computed(
    () => this.cardsCount() <= 1 || this.cardIndex() === this.cardsCount() - 1,
  );

  readonly groupIsOn = computed<boolean>(() =>
    this.devices().some((d) => d.state),
  );

  readonly groupToggleIcon = computed(() =>
    this.groupIsOn() ? 'toggle_on' : 'toggle_off',
  );

  readonly groupToggleClasses = computed(() => ({
    on: this.groupIsOn(),
    off: !this.groupIsOn(),
  }));

  readonly isEditMode = this.store.selectSignal<boolean>(
    dashboardsSelectors.selectIsEditModeEnabled,
  );

  readonly card = computed(() => {
    const tabId = this.selectedTabId();
    const cardId = this.cardId();
    if (!tabId || !cardId) return null;

    const selectCardById = dashboardsSelectors.selectCardById(tabId, cardId);
    return this.store.selectSignal(selectCardById)();
  });

  readonly sensors = computed<Sensor[]>(() =>
    (this.card()?.items ?? [])
      .filter((item): item is SensorItem => item.type === ITEM_TYPES.SENSOR)
      .map(({ type, ...rest }) => rest),
  );

  readonly devices = computed<Device[]>(() =>
    (this.card()?.items ?? [])
      .filter((item): item is DeviceItem => item.type === ITEM_TYPES.DEVICE)
      .map(({ type, ...rest }) => rest),
  );

  readonly cardsInTab = computed(() => {
    const tabId = this.selectedTabId();
    if (!tabId) return [];
    const sel = dashboardsSelectors.selectCardsByTabId(tabId);
    return this.store.selectSignal(sel)() ?? [];
  });

  readonly cardIndex = computed(() => {
    const id = this.cardId();
    const list = this.cardsInTab();
    return id ? list.findIndex((c) => c.id === id) : -1;
  });

  readonly cardsCount = computed(() => this.cardsInTab().length);

  openEditCardModal(): void {
    this.isEditCardOpenModal.set(true);
  }

  closeDelete() {
    this.isEditCardOpenModal.set(false);
  }

  onCardEdit({
    deviceId,
    sensorId,
  }: {
    deviceId: string | null;
    sensorId: string | null;
  }): void {
    const tabId = this.selectedTabId();
    const cardId = this.cardId();
    if (!tabId || !cardId) return;

    if (sensorId) {
      const sensor = this.store.selectSignal(devicesSelectors.selectSensorById(sensorId))(); // SensorItem
      this.store.dispatch(
        TabActionsTitleMove.addItemToCard({ tabId, cardId, item: sensor }),
      );
      this.closeDelete();
      return;
    }

    if (deviceId) {
      const device = this.store.selectSignal(devicesSelectors.selectDeviceById(deviceId))(); // DeviceItem
      this.store.dispatch(
        TabActionsTitleMove.addItemToCard({ tabId, cardId, item: device }),
      );
      this.closeDelete();
    }
  }

  onCardDelete(): void {
    const tabId = this.selectedTabId();
    const cardId = this.cardId();
    if (!tabId || !cardId) return;

    this.store.dispatch(TabActionsTitleMove.removeCard({ tabId, cardId }));
  }

  onReorderCard(targetIndex: number): void {
    const tabId = this.selectedTabId();
    const cardId = this.cardId();
    const from = this.cardIndex();
    const count = this.cardsCount();

    if (!tabId || !cardId || from < 0 || count <= 1) return;

    const max = count - 1;
    const newIndex = Math.max(0, Math.min(targetIndex, max));
    if (newIndex === from) return;

    this.store.dispatch(
      TabActionsTitleMove.reorderCard({ tabId, cardId, newIndex }),
    );
  }

  moveLeft(): void {
    if (this.disableLeft()) return;
    this.onReorderCard(this.cardIndex() - 1);
  }

  moveRight(): void {
    if (this.disableRight()) return;
    this.onReorderCard(this.cardIndex() + 1);
  }

  onGroupToggleClick() {
    const next = !this.groupIsOn();
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

import {
  Component,
  computed,
  inject,
  input,
  OnInit,
  signal,
} from '@angular/core';

import {
  Device,
  DeviceItem,
  Item,
  ITEM_TYPES,
  Sensor,
  SensorItem,
} from '@/app/shared/models/data.model';
import { NgClass } from '@angular/common';
import { SensorComponent } from '@/app/smart-home/components/sensor/sensor.component';
import { DeviceComponent } from '@/app/smart-home/components/device/device.component';

import { LightActiveCardDirective } from '@/app/shared/directives/light-active-card.directive';
import {Store} from '@ngrx/store';
import {AppState} from '@/app/store/state/app.state';
import {RouteIdValidService} from '@/app/shared/services/route-id-valid.service';
import * as SD from '@/app/store/selectors/selected-dashboard.selectors';
import * as AD from '@/app/store/selectors/devices.selectors';
import { ModalEditCardComponent } from '@/app/smart-home/components/modal/modal-edit-card/modal-edit-card.component';
import { AvailableItemsActions } from '@/app/store/actions/devices.actions';
import { selectItemById } from '@/app/store/selectors/devices.selectors';


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

  readonly isEditMode = this.store.selectSignal<boolean>(
    SD.selectIsEditModeEnabled,
  );

  readonly card = computed(() => {
    const tabId = this.selectedTabId();
    const cardId = this.cardId();
    if (!tabId || !cardId) return null;

    const selectCardById = SD.selectCardById(tabId, cardId);
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

  openEditCardModal(): void {
    this.isEditCardOpenModal.set(true);
  }

  closeDelete() {
    this.isEditCardOpenModal.set(false);
  }

  onCardEdit(payload: { deviceId: string | null; sensorId: string | null }): void {
    const tabId = this.selectedTabId();
    const cardId = this.cardId();
    if (!tabId || !cardId) return;

    // Берём из справочника ГОТОВЫЕ объекты
    const device: DeviceItem | null =
      payload.deviceId ? (this.store.selectSignal(selectItemById(payload.deviceId))() as DeviceItem | null) : null;

    const sensor: SensorItem | null =
      payload.sensorId ? (this.store.selectSignal(selectItemById(payload.sensorId))() as SensorItem | null) : null;

    const items: Item[] = [];
    if (device) items.push(device);
    if (sensor) items.push(sensor);


    this.store.dispatch(
      AvailableItemsActions.updateCardItems({
        tabId,
        cardId,
        items,
      }),
    );

    this.closeDelete();
  }
}

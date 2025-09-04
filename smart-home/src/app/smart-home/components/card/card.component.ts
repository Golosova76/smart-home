import {Component, computed, inject, input, OnInit} from '@angular/core';

import {
  Card,
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
import {Store} from '@ngrx/store';
import {AppState} from '@/app/store/state/app.state';
import {RouteIdValidService} from '@/app/shared/services/route-id-valid.service';
import * as SD from '@/app/store/selectors/selected-dashboard.selectors';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [
    NgClass,
    SensorComponent,
    DeviceComponent,
    LightActiveCardDirective,
  ],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss',
})
export class CardComponent implements OnInit {
  private store = inject<Store<AppState>>(Store);
  private readonly routeIds = inject(RouteIdValidService);

  cardId = input<string | null>(null);

  readonly selectedTabId = this.routeIds.selectedTabId;

  readonly isEmptyCard = computed(() => !this.card()?.items?.length);

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

  readonly TYPES = ITEM_TYPES;

  devices: Device[] = [];
  sensors: Sensor[] = [];

  readonly hasGroupToggle = computed(() => this.devices().length > 1);

  ngOnInit() {
    this.updateItems();
  }

  private updateItems() {
    const items = this.card()?.items ?? [];

    this.sensors = items
      .filter((item): item is SensorItem => item.type === this.TYPES.SENSOR)
      .map(({ type, ...sensor }) => sensor);

    this.devices = items
      .filter((item): item is DeviceItem => item.type === this.TYPES.DEVICE)
      .map(({ type, ...device }) => device);
  }
}

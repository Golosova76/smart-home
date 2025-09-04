import {Component, computed, inject, input, OnInit} from '@angular/core';

import {
  Device,
  Sensor,
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
import { AvailableItemsActions as D } from '@/app/store/actions/devices.actions';

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
  readonly hasGroupToggle = computed(() => (this.card()?.items?.length ?? 0) > 1);


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

  devices: Device[] = [];
  sensors: Sensor[] = [];

  readonly device = this.store.selectSignal<Device[]>(AD.selectDevicesNoType);
  readonly sensor = this.store.selectSignal<Sensor[]>(AD.selectSensorsNoType);

  ngOnInit() {
    //this.store.dispatch(D.load());
  }

}

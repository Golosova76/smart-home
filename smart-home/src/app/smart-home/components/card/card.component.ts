import { Component, input, OnInit } from '@angular/core';

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
  card = input<Card>();

  readonly TYPES = ITEM_TYPES;

  devices: Device[] = [];
  sensors: Sensor[] = [];

  ngOnInit() {
    this.updateItems();
  }

  groupToggleChange(event: Event) {
    const input = event.target;
    if (input && input instanceof HTMLInputElement) {
      const newState = input.checked;
      for (const device of this.devices) {
        device.state = newState;
      }
    }
  }

  get groupToggleState(): boolean {
    return this.devices.some((device) => device.state); // хотя бы одно устройство включено
  }

  get hasGroupToggle(): boolean {
    return this.devices.length > 1;
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

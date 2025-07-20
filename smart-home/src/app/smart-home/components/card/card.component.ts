import { Component, input, OnInit } from '@angular/core';

import {
  Card,
  Device,
  DeviceItem,
  Sensor,
  SensorItem,
} from '@/app/shared/models/data.model';
import { NgClass } from '@angular/common';
import { SensorComponent } from '@/app/smart-home/components/sensor/sensor.component';
import { DeviceComponent } from '@/app/smart-home/components/device/device.component';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [NgClass, SensorComponent, DeviceComponent],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss',
})
export class CardComponent implements OnInit {
  card = input<Card>();

  devices: Device[] = [];
  sensors: Sensor[] = [];

  ngOnInit() {
    const items = this.card()?.items ?? [];

    this.sensors = items
      .filter((item): item is SensorItem => item.type === 'sensor')
      .map(({ type, ...sensor }) => sensor);

    this.devices = items
      .filter((item): item is DeviceItem => item.type === 'device')
      .map(({ type, ...device }) => device);
  }
}

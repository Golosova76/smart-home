import { Component, input } from '@angular/core';

import {
  LAYOUT_TYPES,
  LayoutType,
  Sensor,
} from '@/app/shared/models/data.model';
import { SensorValuePipe } from '@/app/shared/pipes/sensor-value.pipe';

@Component({
  selector: 'app-sensor',
  standalone: true,
  imports: [SensorValuePipe],
  templateUrl: './sensor.component.html',
  styleUrl: './sensor.component.scss',
})
export class SensorComponent {
  readonly LAYOUT = LAYOUT_TYPES;

  layout = input<LayoutType>();
  sensor = input<Sensor>();
}

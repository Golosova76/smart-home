import { Component, input } from '@angular/core';

import { LayoutType, Sensor } from '@/app/shared/models/data.model';
import {SensorValuePipe} from '@/app/shared/pipes/sensor-value.pipe';

@Component({
  selector: 'app-sensor',
  standalone: true,
  imports: [
    SensorValuePipe
  ],
  templateUrl: './sensor.component.html',
  styleUrl: './sensor.component.scss',
})
export class SensorComponent {
  layout = input<LayoutType>();
  sensor = input<Sensor>();
}

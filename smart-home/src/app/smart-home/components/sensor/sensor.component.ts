import { Component, input } from '@angular/core';

import { LayoutType, Sensor } from '@/app/shared/models/data.model';

@Component({
  selector: 'app-sensor',
  standalone: true,
  imports: [],
  templateUrl: './sensor.component.html',
  styleUrl: './sensor.component.scss',
})
export class SensorComponent {
  layout = input<LayoutType>();
  sensor = input<Sensor>();
}

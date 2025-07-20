import { Component, input } from '@angular/core';

import { Device } from '@/app/shared/models/data.model';

@Component({
  selector: 'app-device',
  standalone: true,
  imports: [],
  templateUrl: './device.component.html',
  styleUrl: './device.component.scss',
})
export class DeviceComponent {
  device = input<Device>();
}

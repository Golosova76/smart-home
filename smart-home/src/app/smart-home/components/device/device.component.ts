import { Component, input } from '@angular/core';

import { Device, LayoutType } from '@/app/shared/models/data.model';
import {DeviceStatePipe} from '@/app/shared/pipes/device-state.pipe';
import {NgClass} from '@angular/common';
import {LightActiveDeviceDirective} from '@/app/shared/directives/light-active-device.directive';

@Component({
  selector: 'app-device',
  standalone: true,
  imports: [
    DeviceStatePipe,
    NgClass,
    LightActiveDeviceDirective
  ],
  templateUrl: './device.component.html',
  styleUrl: './device.component.scss',
})
export class DeviceComponent {
  device = input<Device>();
  layout = input<LayoutType>();
}

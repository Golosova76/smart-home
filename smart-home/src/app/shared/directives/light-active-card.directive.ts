import { Directive, effect, HostBinding, input } from '@angular/core';
import { Device } from '@/app/shared/models/data.model';

@Directive({
  selector: '[appLightActiveCard]',
  standalone: true,
})
export class LightActiveCardDirective {
  @HostBinding('class.active-card') isActive = false;

  lightActiveCard = input<Device[]>([], { alias: 'appLightActiveCard' });

  constructor() {
    effect(() => {
      const devices = this.lightActiveCard() ?? [];
      this.isActive = devices.some((device) => device.state);
    });
  }
}

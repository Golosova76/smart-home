import {Directive, effect, HostBinding, input} from '@angular/core';
import {Device} from '@/app/shared/models/data.model';

@Directive({
  selector: '[appLightActiveCard]',
  standalone: true,
})
export class LightActiveCardDirective {
  lightActiveCard = input<Device[]>([], { alias: 'appLightActiveCard' })

  @HostBinding('class.active-card') isActive = false;

  constructor() {
    effect(() => {
      const devices = this.lightActiveCard() ?? [];
      this.isActive = devices.some(device => device.state)
    });
  }
}

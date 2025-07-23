import {Directive, effect, HostBinding, input} from '@angular/core';

@Directive({
  selector: '[appLightActiveDevice]'
})
export class LightActiveDeviceDirective {
  lightActiveDevice = input<boolean>(false, { alias: 'appLightActiveDevice' })

  @HostBinding('class.active-device') isActive = false;

  constructor() {
    effect(() => {
      this.isActive = this.lightActiveDevice();
    });
  }

}

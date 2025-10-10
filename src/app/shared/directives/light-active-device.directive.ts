import { Directive, effect, HostBinding, input } from "@angular/core";

@Directive({
  selector: "[appLightActiveDevice]",
})
export class LightActiveDeviceDirective {
  @HostBinding("class.active-device") isActive = false;

  lightActiveDevice = input<boolean>(false, { alias: "appLightActiveDevice" });

  constructor() {
    effect(() => {
      this.isActive = this.lightActiveDevice();
    });
  }
}

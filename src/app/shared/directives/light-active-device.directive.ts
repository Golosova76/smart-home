import type { InputSignal } from "@angular/core";
import { Directive, effect, HostBinding, input } from "@angular/core";

@Directive({
  selector: "[appLightActiveDevice]",
})
export class LightActiveDeviceDirective {
  @HostBinding("class.active-device")
  public isActive: boolean = false;

  public readonly lightActiveDevice: InputSignal<boolean> = input<boolean>(
    false,
    { alias: "appLightActiveDevice" },
  );

  constructor() {
    effect((): void => {
      this.isActive = this.lightActiveDevice();
    });
  }
}

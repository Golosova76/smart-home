import type { EffectRef, InputSignal } from "@angular/core";
import { Directive, effect, HostBinding, input } from "@angular/core";
import type { Device } from "@/app/shared/models/data.model";

@Directive({
  selector: "[appLightActiveCard]",
  standalone: true,
})
export class LightActiveCardDirective {
  @HostBinding("class.active-card")
  public isActive: boolean = false;

  public readonly lightActiveCard: InputSignal<Device[]> = input<Device[]>([], {
    alias: "appLightActiveCard",
  });

  private setActiveEffect: EffectRef = effect((): void => {
    const devices: Device[] = this.lightActiveCard() ?? [];
    this.isActive = devices.some((device: Device): boolean => device.state);
  });
}

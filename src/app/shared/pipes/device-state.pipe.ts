import type { PipeTransform } from "@angular/core";
import { Pipe } from "@angular/core";
import { isNullOrEmpty } from "@/app/shared/utils/is-null-or-empty";

@Pipe({
  name: "deviceState",
})
export class DeviceStatePipe implements PipeTransform {
  public transform(value: boolean | null | undefined): string {
    return isNullOrEmpty(value) ? "ON" : "OFF";
  }
}

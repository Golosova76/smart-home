import type { PipeTransform } from "@angular/core";
import { Pipe } from "@angular/core";

@Pipe({
  name: "deviceState",
})
export class DeviceStatePipe implements PipeTransform {
  transform(value: boolean | null | undefined): string {
    return value ? "ON" : "OFF";
  }
}

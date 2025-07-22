import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'deviceState'
})
export class DeviceStatePipe implements PipeTransform {

  transform(value: boolean | null | undefined): string {
    if (value) return 'ON';
    return 'OFF';
  }
}

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sensorValue'
})
export class SensorValuePipe implements PipeTransform {

  private readonly allUnits = new Set<string>([
    '%', '°C', '°F', 'ppm', 'lux', 'W', 'kWh', 'V', 'A',
    'dB', 'mg/m³', 'g/m³', 'hPa', 'mmHg', 'CO2', 'μg/m³', 'lx'
  ]);

  transform(value: { amount: number; unit: string } | null | undefined): string {
    if (!value) return '';
    const { amount, unit } = value;

    if (this.allUnits.has(unit)) {
      return `${amount} ${unit}`;
    }
    return this.capitalizeText(unit);
  }

  private capitalizeText(text: string): string {
    return text.charAt(0).toUpperCase() + text.slice(1);
  }

}

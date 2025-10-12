import type { PipeTransform } from "@angular/core";
import { Pipe } from "@angular/core";

@Pipe({
  name: "sensorValue",
})
export class SensorValuePipe implements PipeTransform {
  private readonly allUnits = new Set<string>([
    "%",
    "°C",
    "°F",
    "A",
    "CO2",
    "dB",
    "g/m³",
    "hPa",
    "kWh",
    "lux",
    "lx",
    "mg/m³",
    "mmHg",
    "ppm",
    "V",
    "W",
    "μg/m³",
  ]);

  public transform(
    value: null | undefined | { amount: number; unit: string },
  ): string {
    if (!value) return "";
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

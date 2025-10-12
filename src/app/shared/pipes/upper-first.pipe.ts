import type { PipeTransform } from "@angular/core";
import { Pipe } from "@angular/core";
import { isNullOrEmpty } from "@/app/shared/utils/is-null-or-empty";

@Pipe({
  name: "upperFirst",
})
export class UpperFirstPipe implements PipeTransform {
  public transform(value: string | null | undefined): string {
    if (isNullOrEmpty(value)) return "";
    return value.charAt(0).toUpperCase() + value.slice(1);
  }
}

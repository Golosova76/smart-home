import type { AbstractControl, ValidatorFn } from "@angular/forms";

export function uniqueIdValidator(existingIds: string[]): ValidatorFn {
  return (control: AbstractControl) => {
    const value: unknown = control.value;

    if (typeof value !== "string") {
      return null;
    }
    const newId: string = value.trim();
    if (newId.length === 0) return null;

    return existingIds.includes(newId) ? { notUnique: true } : null;
  };
}

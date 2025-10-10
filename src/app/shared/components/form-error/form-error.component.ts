import { Component, input } from "@angular/core";
import type { AbstractControl } from "@angular/forms";

@Component({
  selector: "app-form-error",
  imports: [],
  templateUrl: "./form-error.component.html",
  styleUrl: "./form-error.component.scss",
})
export class FormErrorComponent {
  control = input<AbstractControl<unknown> | null>(null);

  get isNoTouch(): boolean {
    const control = this.control();
    return Boolean(control && (control.touched || control.dirty));
  }

  get messages(): string[] {
    const control = this.control();
    if (control === null) return [];

    if (!(control.touched || control.dirty)) {
      return [];
    }

    const errors = control.errors;

    if (errors === null) return [];

    const result: string[] = [];

    if ("required" in errors) {
      result.push("This field is required");
    }

    const maxErrorUnknown: unknown = Reflect.get(errors, "maxlength");
    if (typeof maxErrorUnknown === "object" && maxErrorUnknown !== null) {
      const requiredLengthValue: unknown = Reflect.get(
        maxErrorUnknown,
        "requiredLength",
      );
      if (typeof requiredLengthValue === "number") {
        result.push(`Maximum length is ${requiredLengthValue} characters`);
      }
    }

    if ("notUnique" in errors) {
      result.push("This ID already exists");
    }

    return result;
  }
}

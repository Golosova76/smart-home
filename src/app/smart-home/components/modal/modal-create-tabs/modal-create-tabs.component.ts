import type { OutputEmitterRef } from "@angular/core";
import { Component, output } from "@angular/core";
import { ModalHeaderComponent } from "@/app/smart-home/components/modal/components/modal-header/modal-header.component";
import { ModalFooterComponent } from "@/app/smart-home/components/modal/components/modal-footer/modal-footer.component";
import { FormErrorComponent } from "@/app/shared/components/form-error/form-error.component";
import type { AbstractControl } from "@angular/forms";
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { ModalShellComponent } from "@/app/smart-home/components/modal/modal-shell/modal-shell.component";
import { capitalize } from "@/app/shared/utils/capitalize";
import { MAX_LENGTH } from "@/app/shared/utils/constants";

@Component({
  selector: "app-modal-create-tabs",
  imports: [
    ModalHeaderComponent,
    ModalFooterComponent,
    FormErrorComponent,
    ReactiveFormsModule,
    ModalShellComponent,
  ],
  templateUrl: "./modal-create-tabs.component.html",
  styleUrl: "./modal-create-tabs.component.scss",
})
export class ModalCreateTabsComponent {
  public form = new FormGroup({
    title: new FormControl<string | null>(null, [
      Validators.required,
      Validators.maxLength(MAX_LENGTH),
    ]),
  });

  protected readonly closed: OutputEmitterRef<void> = output<void>();
  protected readonly submitted: OutputEmitterRef<string> = output<string>();

  public get canSubmit(): boolean {
    return this.form.valid;
  }

  public get titleControl(): FormControl<string | null> | null {
    const control: AbstractControl | null = this.form.get("title");
    return control instanceof FormControl ? control : null;
  }

  public closeModal(): void {
    this.closed.emit();
  }

  public onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const raw: string | null = this.form.controls.title?.value ?? null;
    if (raw === null) return;

    const trimmedTitle = raw.trim();
    if (!trimmedTitle) return;
    const capitalizedTitle = capitalize(trimmedTitle);

    this.submitted.emit(capitalizedTitle);
  }
}

import { Component, output, type OutputEmitterRef } from "@angular/core";
import { ModalShellComponent } from "@/app/smart-home/components/modal/modal-shell/modal-shell.component";
import { ModalHeaderComponent } from "@/app/smart-home/components/modal/components/modal-header/modal-header.component";
import { ModalFooterComponent } from "@/app/smart-home/components/modal/components/modal-footer/modal-footer.component";
import type { AbstractControl } from "@angular/forms";
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import type { LayoutType } from "@/app/shared/models/data.model";
import { FormErrorComponent } from "@/app/shared/components/form-error/form-error.component";
import { capitalize } from "@/app/shared/utils/capitalize";
import { MAX_LENGTH } from "@/app/shared/utils/constants";

@Component({
  selector: "app-modal-create-card",
  imports: [
    ModalShellComponent,
    ModalHeaderComponent,
    ModalFooterComponent,
    FormErrorComponent,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: "./modal-create-card.component.html",
  styleUrl: "./modal-create-card.component.scss",
})
export class ModalCreateCardComponent {
  public form = new FormGroup({
    title: new FormControl<string | null>(null, [
      Validators.required,
      Validators.maxLength(MAX_LENGTH),
    ]),
    layout: new FormControl<LayoutType | null>(null, [Validators.required]),
  });

  protected readonly closed: OutputEmitterRef<void> = output<void>();
  protected readonly submitted = output<{
    title: string;
    layout: LayoutType;
  }>();

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

    const { title, layout } = this.form.value;
    if (typeof title !== "string") return;
    if (layout == null) return;

    const capitalizedTitle: string = capitalize(title);

    this.submitted.emit({ title: capitalizedTitle.trim(), layout });
  }
}

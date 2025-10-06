import { Component, output } from '@angular/core';
import { ModalHeaderComponent } from '@/app/smart-home/components/modal/components/modal-header/modal-header.component';
import { ModalFooterComponent } from '@/app/smart-home/components/modal/components/modal-footer/modal-footer.component';
import { FormErrorComponent } from '@/app/shared/components/form-error/form-error.component';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ModalShellComponent } from '@/app/smart-home/components/modal/modal-shell/modal-shell.component';
import { capitalize } from '@/app/shared/utils/capitalize';

@Component({
  selector: 'app-modal-create-tabs',
  imports: [
    ModalHeaderComponent,
    ModalFooterComponent,
    FormErrorComponent,
    ReactiveFormsModule,
    ModalShellComponent,
  ],
  templateUrl: './modal-create-tabs.component.html',
  styleUrl: './modal-create-tabs.component.scss',
})
export class ModalCreateTabsComponent {
  readonly closed = output<void>();
  readonly submitted = output<string>();

  form = new FormGroup({
    title: new FormControl<string | null>(null, [
      Validators.required,
      Validators.maxLength(50),
    ]),
  });

  closeModal() {
    this.closed.emit();
  }

  get canSubmit(): boolean {
    return this.form.valid;
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { title } = this.form.value;
    if (!title) return;

    const trimmedTitle = title.trim();
    if (!trimmedTitle) return;
    const capitalizedTitle = capitalize(trimmedTitle);

    this.submitted.emit(capitalizedTitle);
  }

  get titleControl(): FormControl<string | null> | null {
    const control: AbstractControl | null = this.form.get('title');
    return control instanceof FormControl ? control : null;
  }
}

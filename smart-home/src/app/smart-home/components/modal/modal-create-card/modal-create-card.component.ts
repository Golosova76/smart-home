import { Component, output } from '@angular/core';
import { ModalShellComponent } from '@/app/smart-home/components/modal/modal-shell/modal-shell.component';
import { ModalHeaderComponent } from '@/app/smart-home/components/modal/components/modal-header/modal-header.component';
import { ModalFooterComponent } from '@/app/smart-home/components/modal/components/modal-footer/modal-footer.component';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { LayoutType } from '@/app/shared/models/data.model';
import { FormErrorComponent } from '@/app/shared/components/form-error/form-error.component';
import { capitalize } from '@/app/shared/utils/capitalize';

@Component({
  selector: 'app-modal-create-card',
  imports: [
    ModalShellComponent,
    ModalHeaderComponent,
    ModalFooterComponent,
    FormErrorComponent,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './modal-create-card.component.html',
  styleUrl: './modal-create-card.component.scss',
})
export class ModalCreateCardComponent {
  readonly closed = output<void>();
  readonly submitted = output<{ title: string; layout: LayoutType }>();

  readonly form = new FormGroup({
    title: new FormControl<string | null>(null, [
      Validators.required,
      Validators.maxLength(50),
    ]),
    layout: new FormControl<LayoutType | null>(null, [Validators.required]),
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

    const { title, layout } = this.form.value;
    if (!title || !layout) return;
    const capitalizedTitle = capitalize(title);

    this.submitted.emit({ title: capitalizedTitle.trim(), layout });
  }

  get titleControl(): FormControl<string | null> | null {
    const control: AbstractControl | null = this.form.get('title');
    return control instanceof FormControl ? control : null;
  }
}

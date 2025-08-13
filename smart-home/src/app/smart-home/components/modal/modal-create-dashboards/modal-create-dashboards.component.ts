import {
  Component,
  effect,
  input,
  OnInit,
  output,
} from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { uniqueIdValidator } from '@/app/shared/unique-id.validator';
import { FormErrorComponent } from '@/app/shared/components/form-error/form-error.component';

@Component({
  selector: 'app-modal-create-dashboards',
  imports: [FormsModule, ReactiveFormsModule, FormErrorComponent],
  templateUrl: './modal-create-dashboards.component.html',
  styleUrl: './modal-create-dashboards.component.scss',
})
export class ModalCreateDashboardsComponent implements OnInit {
  closed = output<void>();
  checkId = input<string[]>([]);

  form = new FormGroup({
    id: new FormControl<string | null>(null, [
      Validators.required,
      Validators.maxLength(30),
      uniqueIdValidator(this.checkId()),
    ]),
    title: new FormControl<string | null>(null, [
      Validators.required,
      Validators.maxLength(50),
    ]),
    icon: new FormControl<string | null>(null, Validators.required),
  });

  constructor() {
    effect(() => {
      const ids = this.checkId(); // актуальные existingIds
      const control: AbstractControl | null = this.form.get('id');

      if (control instanceof FormControl) {
        control.setValidators([
          Validators.required,
          Validators.maxLength(30),
          uniqueIdValidator(ids),
        ]);
        // обновляем валидность по текущему значению
        control.updateValueAndValidity({ emitEvent: false });
      }
    });
  }

  ngOnInit(): void {
    this.titleControl?.updateValueAndValidity({ emitEvent: false });
    this.iconControl?.updateValueAndValidity({ emitEvent: false });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.closed.emit();
  }

  closeModal() {
    this.closed.emit();
  }

  get idControl(): FormControl<string | null> | null {
    const control: AbstractControl | null = this.form.get('id');
    return control instanceof FormControl ? control : null;
  }

  get titleControl(): FormControl<string | null> | null {
    const control: AbstractControl | null = this.form.get('title');
    return control instanceof FormControl ? control : null;
  }

  get iconControl(): FormControl<string | null> | null {
    const control: AbstractControl | null = this.form.get('icon');
    return control instanceof FormControl ? control : null;
  }

  get canSubmit(): boolean {
    return this.form.valid;
  }
}

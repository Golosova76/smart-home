import {
  Component,
  DestroyRef,
  effect,
  inject,
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
import { Dashboard } from '@/app/shared/models/dashboard.model';
import { DashboardService } from '@/app/shared/services/dashboard.service';
import { switchMap, tap } from 'rxjs';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { capitalize, normalizeId } from '@/app/shared/capitalize';

@Component({
  selector: 'app-modal-create-dashboards',
  imports: [FormsModule, ReactiveFormsModule, FormErrorComponent],
  templateUrl: './modal-create-dashboards.component.html',
  styleUrl: './modal-create-dashboards.component.scss',
})
export class ModalCreateDashboardsComponent implements OnInit {
  dashboardService = inject(DashboardService);
  router = inject(Router);
  destroyRef = inject(DestroyRef);

  readonly dashboardsSignal = this.dashboardService.dashboardsSignal;

  closed = output<void>();
  checkId = input<string[]>([]);

  private lastIds: string[] = [];

  form = new FormGroup({
    id: new FormControl<string | null>(null),
    title: new FormControl<string | null>(null, [
      Validators.required,
      Validators.maxLength(50),
    ]),
    icon: new FormControl<string | null>(null, Validators.required),
  });

  constructor() {
    effect(() => {
      const ids = this.checkId();
      if (!this.arraysEqual(ids, this.lastIds)) {
        this.lastIds = [...ids];
        this.updateIdValidators(ids);
      }
    });
  }

  ngOnInit(): void {
    this.idControl?.updateValueAndValidity({ emitEvent: false });
    this.titleControl?.updateValueAndValidity({ emitEvent: false });
    this.iconControl?.updateValueAndValidity({ emitEvent: false });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { id, title, icon } = this.form.value;
    if (!id || !title || !icon) return;

    const normId: string = normalizeId(id);

    const payload: Dashboard = {
      id: normId,
      title: capitalize(title),
      icon,
    };

    this.dashboardService
      .createDashboard(payload)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        switchMap(() => this.dashboardService.getDashboards()),
        tap((dashboards) => this.dashboardsSignal.set(dashboards)),
        tap(() => {
          this.closed.emit();
          this.router.navigate(['/dashboard', normId]).catch(() => {});
        }),
      )
      .subscribe();
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

  private getIdValidators(ids: string[]) {
    return [
      Validators.required,
      Validators.maxLength(30),
      uniqueIdValidator(ids),
    ];
  }

  private updateIdValidators(ids: string[]) {
    const control: AbstractControl | null = this.form.get('id');

    if (control instanceof FormControl) {
      control.setValidators(this.getIdValidators(ids));
      control.updateValueAndValidity({ emitEvent: false });
    }
  }

  private arraysEqual(a: string[], b: string[]): boolean {
    return a.length === b.length && a.every((v, index) => v === b[index]);
  }
}

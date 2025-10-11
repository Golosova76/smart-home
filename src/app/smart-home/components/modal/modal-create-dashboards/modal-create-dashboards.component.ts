import type { InputSignal, OnInit, OutputEmitterRef } from "@angular/core";
import { Component, effect, inject, input, output } from "@angular/core";
import type { AbstractControl, ValidatorFn } from "@angular/forms";
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { uniqueIdValidator } from "@/app/shared/utils/unique-id.validator";
import { FormErrorComponent } from "@/app/shared/components/form-error/form-error.component";
import type {
  Dashboard,
  EntityActions,
} from "@/app/shared/models/dashboard.model";
import { Router } from "@angular/router";
import { capitalize, normalizeId } from "@/app/shared/utils/capitalize";
import { ModalShellComponent } from "@/app/smart-home/components/modal/modal-shell/modal-shell.component";
import { ModalHeaderComponent } from "@/app/smart-home/components/modal/components/modal-header/modal-header.component";
import { ModalFooterComponent } from "@/app/smart-home/components/modal/components/modal-footer/modal-footer.component";
import { MAX_LENGTH, MAX_LENGTH_ID } from "@/app/shared/utils/constants";

@Component({
  selector: "app-modal-create-dashboards",
  imports: [
    FormsModule,
    ReactiveFormsModule,
    FormErrorComponent,
    ModalShellComponent,
    ModalHeaderComponent,
    ModalFooterComponent,
  ],
  templateUrl: "./modal-create-dashboards.component.html",
  styleUrl: "./modal-create-dashboards.component.scss",
})
export class ModalCreateDashboardsComponent implements OnInit {
  public form = new FormGroup({
    id: new FormControl<string | null>(null),
    title: new FormControl<string | null>(null, [
      Validators.required,
      Validators.maxLength(MAX_LENGTH),
    ]),
    icon: new FormControl<string | null>(null, Validators.required),
  });
  private readonly router: Router = inject(Router);

  public readonly closed: OutputEmitterRef<void> = output<void>();
  public readonly checkId: InputSignal<string[]> = input<string[]>([]);
  public readonly entityActions: InputSignal<EntityActions> =
    input.required<EntityActions>();

  public readonly submitted = output<{
    id: string;
    title: string;
    icon: string;
  }>();

  public lastIds: string[] = [];

  constructor() {
    effect((): void => {
      const ids: string[] = this.checkId();
      if (!this.arraysEqual(ids, this.lastIds)) {
        this.lastIds = [...ids];
        this.updateIdValidators(ids);
      }
    });
  }

  public get idControl(): FormControl<string | null> | null {
    const control: AbstractControl | null = this.form.get("id");
    return control instanceof FormControl ? control : null;
  }

  public get titleControl(): FormControl<string | null> | null {
    const control: AbstractControl | null = this.form.get("title");
    return control instanceof FormControl ? control : null;
  }

  public get iconControl(): FormControl<string | null> | null {
    const control: AbstractControl | null = this.form.get("icon");
    return control instanceof FormControl ? control : null;
  }

  public get canSubmit(): boolean {
    return this.form.valid;
  }

  public ngOnInit(): void {
    this.idControl?.updateValueAndValidity({ emitEvent: false });
    this.titleControl?.updateValueAndValidity({ emitEvent: false });
    this.iconControl?.updateValueAndValidity({ emitEvent: false });
  }

  public onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { id, title, icon } = this.form.value;
    if (typeof id !== "string" || id.trim().length === 0) return;
    if (typeof title !== "string" || title.trim().length === 0) return;
    if (typeof icon !== "string" || icon.trim().length === 0) return;

    const normId: string = normalizeId(id);

    const payload: Dashboard = {
      id: normId,
      title: capitalize(title),
      icon,
    };
    this.submitted.emit(payload);
  }

  public closeModal(): void {
    this.closed.emit();
  }

  private getIdValidators(ids: string[]): ValidatorFn[] {
    return [
      Validators.required,
      Validators.maxLength(MAX_LENGTH_ID),
      uniqueIdValidator(ids),
    ];
  }

  private updateIdValidators(ids: string[]): void {
    const control: AbstractControl | null = this.form.get("id");

    if (control instanceof FormControl) {
      control.setValidators(this.getIdValidators(ids));
      control.updateValueAndValidity({ emitEvent: false });
    }
  }

  private arraysEqual(a: string[], b: string[]): boolean {
    return a.length === b.length && a.every((v, index) => v === b[index]);
  }
}

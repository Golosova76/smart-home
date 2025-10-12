import type { OnDestroy, WritableSignal } from "@angular/core";
import { Component, inject, signal } from "@angular/core";
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { AuthService } from "@/app/core/auth/services/auth/auth.service";
import { Router } from "@angular/router";
import type { HttpErrorResponse } from "@angular/common/http";
import { Subject } from "rxjs";
import { UNAUTHENTIC_STATUS_CODE } from "@/app/shared/utils/constants";

@Component({
  selector: "app-login-page",
  imports: [ReactiveFormsModule],
  templateUrl: "./login-page.component.html",
  styleUrl: "./login-page.component.scss",
})
export class LoginPageComponent implements OnDestroy {
  private readonly authService: AuthService = inject(AuthService);
  private readonly router: Router = inject(Router);
  private destroy$: Subject<void> = new Subject<void>();

  public form: FormGroup<{
    username: FormControl<string | null>;
    password: FormControl<string | null>;
  }> = new FormGroup({
    username: new FormControl<string | null>(null, Validators.required),
    password: new FormControl<string | null>(null, Validators.required),
  });

  public isPasswordVisible: WritableSignal<boolean> = signal<boolean>(false);

  public errorMessage: WritableSignal<string | null> = signal<string | null>(
    null,
  );

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public togglePasswordVisible(): void {
    this.isPasswordVisible.set(!this.isPasswordVisible());
  }

  public onSubmit(): void {
    if (!this.form.valid) return;
    const formData = {
      userName: this.form.value.username ?? "",
      password: this.form.value.password ?? "",
    };
    this.authService.login(formData).subscribe({
      next: (): void => {
        this.router.navigate([""]).then((): void => {});
      },
      error: (error: HttpErrorResponse): void => {
        if (error.status === UNAUTHENTIC_STATUS_CODE) {
          this.errorMessage.set("Invalid login or password.");
          return;
        }
        this.errorMessage.set(
          "Unknown error occurred. Please try again later.",
        );
      },
    });
  }
}

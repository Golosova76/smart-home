import {Component, inject, OnDestroy, signal} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '@/app/core/auth/services/auth/auth.service';
import { Router } from '@angular/router';
import { ProfileService } from '@/app/shared/services/profile.service';
import { HttpErrorResponse } from '@angular/common/http';
import { DashboardService } from '@/app/shared/services/dashboard.service';
import {EMPTY, map, Subject, switchMap, takeUntil} from 'rxjs';


@Component({
  selector: 'app-login-page',
  imports: [ReactiveFormsModule],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss',
})
export class LoginPageComponent implements OnDestroy {
  private authService = inject(AuthService);
  private router = inject(Router);
  private profileService = inject(ProfileService);
  dashboardService = inject(DashboardService);

  private destroy$ = new Subject<void>();

  isPasswordVisible = signal<boolean>(false);

  errorMessage = signal<string | null>(null);

  form: FormGroup<{
    username: FormControl<string | null>;
    password: FormControl<string | null>;
  }> = new FormGroup({
    username: new FormControl<string | null>(null, Validators.required),
    password: new FormControl<string | null>(null, Validators.required),
  });

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  togglePasswordVisible(): void {
    this.isPasswordVisible.set(!this.isPasswordVisible());
  }

  onSubmit() {
    if (!this.form.valid) return;
    const formData = {
      userName: this.form.value.username ?? '',
      password: this.form.value.password ?? '',
    };
    this.authService.login(formData).pipe(
      switchMap(() => this.profileService.getProfile()),
      switchMap(() => this.dashboardService.getDashboards()),
      switchMap((dashboards) => {
        if (!dashboards.length) return EMPTY;
        const firstDashboard = dashboards[0];
        return this.dashboardService.getDashboardById(firstDashboard.id).pipe(
          map((data) => ({data, firstDashboard}))
        );
      }),
      takeUntil(this.destroy$),
    )
    .subscribe({
      next: (result) => {
        if (!result) return;
        const {data, firstDashboard} = result;
        if (!data.tabs?.length) return;
        const firstTabId = data.tabs[0].id;
        this.router
          .navigate(['/dashboard', firstDashboard.id, firstTabId])
          .catch(() => {});
      },
      error: (error: HttpErrorResponse) => {
        if (error.status === 401) {
          this.errorMessage.set('Invalid login or password.');
          return;
        }
        this.errorMessage.set('Unknown error occurred. Please try again later.');
      }
    });
  }
}

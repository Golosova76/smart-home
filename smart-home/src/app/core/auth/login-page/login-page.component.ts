import { Component, inject, signal } from '@angular/core';
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

@Component({
  selector: 'app-login-page',
  imports: [ReactiveFormsModule],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss',
})
export class LoginPageComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private profileService = inject(ProfileService);
  dashboardService = inject(DashboardService);

  isPasswordVisible = signal<boolean>(false);

  errorMessage = signal<string | null>(null);

  form: FormGroup<{
    username: FormControl<string | null>;
    password: FormControl<string | null>;
  }> = new FormGroup({
    username: new FormControl<string | null>(null, Validators.required),
    password: new FormControl<string | null>(null, Validators.required),
  });

  togglePasswordVisible(): void {
    this.isPasswordVisible.set(!this.isPasswordVisible());
  }

  onSubmit() {
    if (this.form.valid) {
      const formData = {
        userName: this.form.value.username ?? '',
        password: this.form.value.password ?? '',
      };
      this.authService.login(formData).subscribe({
        next: () => {
          this.profileService.getProfile().subscribe();
          this.dashboardService.getDashboards().subscribe({
            next: (dashboards) => {
              if (dashboards.length === 0) return;
              const firstDashboard = dashboards[0];
              this.dashboardService
                .getDashboardById(firstDashboard.id)
                .subscribe({
                  next: (data) => {
                    if (data.tabs && data.tabs.length > 0) {
                      const firstTabId = data.tabs[0].id;
                      this.router
                        .navigate(['/dashboard', firstDashboard.id, firstTabId])
                        .catch(() => {});
                    }
                  },
                });
            },
          });
        },
        error: (error: HttpErrorResponse) => {
          if (error.status === 401) {
            this.errorMessage.set('Invalid login or password.');
          } else {
            this.errorMessage.set(
              'Unknown error occurred. Please try again later.',
            );
          }
        },
      });
    }
  }
}

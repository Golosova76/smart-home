import { Component, inject, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '@/app/core/auth/services/auth/auth.service';
import { Router } from '@angular/router';
import {ProfileService} from '@/app/shared/services/profile.service';

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

  isPasswordVisible = signal<boolean>(false);

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
      this.authService.login(formData).subscribe(async () => {
        this.profileService.getProfile().subscribe();
        await this.router.navigate(['']);
      });
    }
  }
}

import { Component, DestroyRef, inject, input } from '@angular/core';
import { ProfileService } from '@/app/shared/services/profile.service';
import { AuthService } from '@/app/core/auth/services/auth/auth.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-sidebar-footer',
  standalone: true,
  imports: [],
  templateUrl: './sidebar-footer.component.html',
  styleUrl: './sidebar-footer.component.scss',
})
export class SidebarFooterComponent {
  profileService = inject(ProfileService);
  authService = inject(AuthService);
  destroyRef = inject(DestroyRef);

  sidebarCollapsed = input<boolean>(false);

  readonly profile = this.profileService.profile;

  constructor() {
    this.profileService
      .getProfile()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (profile) => this.profile.set(profile),
      });
  }

  onLogout() {
    this.authService.logout();
  }
}

import {
  Component,
  computed,
  DestroyRef,
  inject,
  input,
  signal,
} from '@angular/core';
import { ProfileService } from '@/app/shared/services/profile.service';
import { AuthService } from '@/app/core/auth/services/auth/auth.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ModalCreateDashboardsComponent } from '@/app/smart-home/components/modal/modal-create-dashboards/modal-create-dashboards.component';
import { DashboardService } from '@/app/shared/services/dashboard.service';

@Component({
  selector: 'app-sidebar-footer',
  standalone: true,
  imports: [ModalCreateDashboardsComponent],
  templateUrl: './sidebar-footer.component.html',
  styleUrl: './sidebar-footer.component.scss',
})
export class SidebarFooterComponent {
  profileService = inject(ProfileService);
  authService = inject(AuthService);
  destroyRef = inject(DestroyRef);
  dashboardService = inject(DashboardService);

  readonly sidebarCollapsed = input<boolean>(false);
  readonly isCreateOpenModal = signal<boolean>(false);
  readonly dashboardsSignal = this.dashboardService.dashboardsSignal;

  readonly checkId = computed(() =>
    this.dashboardsSignal().map((dash) => dash.id),
  );

  readonly profile = this.profileService.profile;

  constructor() {
    this.profileService
      .getProfile()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (profile) => this.profile.set(profile),
      });
  }

  openCreate() {
    this.isCreateOpenModal.set(true);
  }

  closeCreate() {
    this.isCreateOpenModal.set(false);
  }

  onLogout() {
    this.authService.logout();
  }
}

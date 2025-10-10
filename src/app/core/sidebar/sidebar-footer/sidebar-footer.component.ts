import {
  Component,
  computed,
  DestroyRef,
  inject,
  input,
  signal,
} from "@angular/core";
import { ProfileService } from "@/app/shared/services/profile.service";
import { AuthService } from "@/app/core/auth/services/auth/auth.service";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { ModalCreateDashboardsComponent } from "@/app/smart-home/components/modal/modal-create-dashboards/modal-create-dashboards.component";

import type { Dashboard } from "@/app/shared/models/dashboard.model";
import { map, switchMap, tap } from "rxjs";
import { Router } from "@angular/router";
import { DashboardHandlerService } from "@/app/shared/services/dashboard-handler.service";

@Component({
  selector: "app-sidebar-footer",
  standalone: true,
  imports: [ModalCreateDashboardsComponent],
  templateUrl: "./sidebar-footer.component.html",
  styleUrl: "./sidebar-footer.component.scss",
})
export class SidebarFooterComponent {
  profileService = inject(ProfileService);
  authService = inject(AuthService);
  destroyRef = inject(DestroyRef);
  handlerService = inject(DashboardHandlerService);
  router = inject(Router);

  readonly sidebarCollapsed = input<boolean>(false);
  readonly isCreateOpenModal = signal<boolean>(false);
  readonly dashboardsSignal = this.handlerService.dashboardsSignal;

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

  handleCreate(dto: Dashboard) {
    this.handlerService
      .addDashboard(dto)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        switchMap((created) =>
          this.handlerService.loadDashboards().pipe(map(() => created)),
        ),
        tap((created) => {
          this.router.navigate(["/dashboard", created.id]).catch(() => {});
          this.isCreateOpenModal.set(false);
        }),
      )
      .subscribe();
  }
}

import type { InputSignal, Signal, WritableSignal } from "@angular/core";
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
import type { Observable } from "rxjs";
import { map, switchMap, tap } from "rxjs";
import { Router } from "@angular/router";
import { DashboardHandlerService } from "@/app/shared/services/dashboard-handler.service";
import type { UserProfile } from "@/app/shared/models/profile.model";
import { LoaderOverlayComponent } from "@/app/shared/components/loader-overlay/loader-overlay.component";
import { LoadingService } from "@/app/shared/services/loading.service";

@Component({
  selector: "app-sidebar-footer",
  standalone: true,
  imports: [ModalCreateDashboardsComponent, LoaderOverlayComponent],
  templateUrl: "./sidebar-footer.component.html",
  styleUrl: "./sidebar-footer.component.scss",
})
export class SidebarFooterComponent {
  private readonly profileService: ProfileService = inject(ProfileService);
  private readonly authService: AuthService = inject(AuthService);
  private readonly destroyRef: DestroyRef = inject(DestroyRef);
  private readonly handlerService: DashboardHandlerService = inject(
    DashboardHandlerService,
  );
  private readonly router: Router = inject(Router);
  private readonly loading: LoadingService = inject(LoadingService);

  public readonly sidebarCollapsed: InputSignal<boolean> =
    input<boolean>(false);
  public readonly isCreateOpenModal: WritableSignal<boolean> =
    signal<boolean>(false);
  public readonly dashboardsSignal: WritableSignal<Dashboard[]> =
    this.handlerService.dashboardsSignal;

  public readonly checkId: Signal<string[]> = computed((): string[] =>
    this.dashboardsSignal().map((dash: Dashboard): string => dash.id),
  );

  public readonly isUserLoading: WritableSignal<boolean> =
    this.loading.visible("user");

  public readonly profile: WritableSignal<UserProfile | null> =
    this.profileService.profile;

  public readonly isFooterBusy: Signal<boolean> = computed((): boolean =>
    this.isUserLoading(),
  );

  constructor() {
    this.profileService
      .getProfile()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (profile: UserProfile): void => this.profile.set(profile),
      });
  }

  public openCreate(): void {
    this.isCreateOpenModal.set(true);
  }

  public closeCreate(): void {
    this.isCreateOpenModal.set(false);
  }

  public onLogout(): void {
    this.authService.logout();
  }

  public handleCreate(dto: Dashboard): void {
    this.handlerService
      .addDashboard(dto)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        switchMap(
          (created: Dashboard): Observable<Dashboard> =>
            this.handlerService
              .loadDashboards()
              .pipe(map((): Dashboard => created)),
        ),
        tap((created: Dashboard): void => {
          this.router
            .navigate(["/dashboard", created.id])
            .catch((): void => {});
          this.isCreateOpenModal.set(false);
        }),
      )
      .subscribe();
  }
}

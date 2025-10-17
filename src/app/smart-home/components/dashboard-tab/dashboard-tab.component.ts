import type { Signal, WritableSignal } from "@angular/core";
import { Component, computed, inject, signal } from "@angular/core";
import { CardListComponent } from "@/app/smart-home/components/card-list/card-list.component";
import * as dashboardsSelectors from "@/app/store/selectors/selected-dashboard.selectors";
import { Store } from "@ngrx/store";
import type { AppState } from "@/app/store/state/app.state";
import { RouteIdValidService } from "@/app/shared/services/route-id-valid.service";
import { ModalCreateCardComponent } from "@/app/smart-home/components/modal/modal-create-card/modal-create-card.component";

import * as dashboardActions from "@/app/store/actions/dashboard.actions";
import type { Card, LayoutType } from "@/app/shared/models/data.model";
import { isNullOrEmpty } from "@/app/shared/utils/is-null-or-empty";
import { LoaderOverlayComponent } from "@/app/shared/components/loader-overlay/loader-overlay.component";
import { LoadingService } from "@/app/shared/services/loading.service";

@Component({
  selector: "app-dashboard-tab",
  imports: [
    CardListComponent,
    ModalCreateCardComponent,
    LoaderOverlayComponent,
  ],
  templateUrl: "./dashboard-tab.component.html",
  styleUrl: "./dashboard-tab.component.scss",
})
export class DashboardTabComponent {
  private readonly store: Store<AppState> = inject<Store<AppState>>(Store);
  private readonly routeIds: RouteIdValidService = inject(RouteIdValidService);

  public readonly selectedTabId: Signal<string | null> =
    this.routeIds.selectedTabId;

  public isAddCardOpenModal: WritableSignal<boolean> = signal<boolean>(false);

  private readonly loading: LoadingService = inject(LoadingService);

  public readonly isDashboardLoading: Signal<boolean> =
    this.loading.visible("dashboard");

  public readonly isEditMode: Signal<boolean> =
    this.store.selectSignal<boolean>(
      dashboardsSelectors.selectIsEditModeEnabled,
    );

  public readonly selectedDashboardInitialized: Signal<boolean> =
    this.store.selectSignal<boolean>(
      dashboardsSelectors.selectDashboardInitialized,
    );

  public readonly isDashboardBusy: Signal<boolean> = computed(
    (): boolean =>
      !this.selectedDashboardInitialized() || this.isDashboardLoading(),
  );

  public readonly cards: Signal<Card[]> = computed((): Card[] => {
    const tabId: string | null = this.selectedTabId();
    if (isNullOrEmpty(tabId)) return [];

    const selectCardsByTabId = dashboardsSelectors.selectCardsByTabId(tabId);
    return this.store.selectSignal(selectCardsByTabId)();
  });

  public openAddCardModal(): void {
    if (!this.isEditMode()) {
      return;
    }
    this.isAddCardOpenModal.set(true);
  }

  public onAddCardSubmit({
    layout,
    title,
  }: {
    layout: LayoutType;
    title: string;
  }): void {
    const tabId: string | null = this.selectedTabId();
    if (isNullOrEmpty(tabId)) return;
    this.store.dispatch(
      dashboardActions.TabActionsTitleMove.addCard({ tabId, layout, title }),
    );
    this.closeDelete();
  }

  public closeDelete(): void {
    this.isAddCardOpenModal.set(false);
  }
}

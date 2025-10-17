import type { Signal, WritableSignal } from "@angular/core";
import {
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  signal,
} from "@angular/core";

import { TabSwitcherComponent } from "@/app/smart-home/components/tab-switcher/tab-switcher.component";
import { RouterOutlet } from "@angular/router";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { map, switchMap } from "rxjs";
import { ModalConfirmDeleteComponent } from "@/app/smart-home/components/modal/modal-confirm-delete/modal-confirm-delete.component";
import { DashboardHandlerService } from "@/app/shared/services/dashboard-handler.service";
import { RouteIdValidService } from "@/app/shared/services/route-id-valid.service";
import { Store } from "@ngrx/store";

import * as dashboardsSelectors from "@/app/store/selectors/selected-dashboard.selectors";
import * as dashboardActions from "@/app/store/actions/dashboard.actions";
import type { AppState } from "@/app/store/state/app.state";
import type { Tab } from "@/app/shared/models/data.model";
import { ModalCreateTabsComponent } from "@/app/smart-home/components/modal/modal-create-tabs/modal-create-tabs.component";
import {
  isNonEmptyString,
  isNullOrEmpty,
} from "@/app/shared/utils/is-null-or-empty";
import { LoadingService } from "@/app/shared/services/loading.service";

@Component({
  imports: [
    TabSwitcherComponent,
    RouterOutlet,
    ModalConfirmDeleteComponent,
    ModalCreateTabsComponent,
  ],
  selector: "app-dashboard",
  standalone: true,
  styleUrl: "./dashboard.component.scss",
  templateUrl: "./dashboard.component.html",
})
export class DashboardComponent {
  private readonly destroyRef: DestroyRef = inject(DestroyRef);
  private readonly handlerService: DashboardHandlerService = inject(
    DashboardHandlerService,
  );
  private readonly routeIds: RouteIdValidService = inject(RouteIdValidService);
  private readonly store: Store<AppState> = inject<Store<AppState>>(Store);
  private readonly loading: LoadingService = inject(LoadingService);

  public readonly isDashboardLoading: WritableSignal<boolean> =
    this.loading.visible("dashboard");

  public readonly isDashboardBusy: Signal<boolean> = computed(
    (): boolean =>
      !this.selectedDashboardInitialized() || this.isDashboardLoading(),
  );

  public readonly selectedDashboardInitialized: Signal<boolean> =
    this.store.selectSignal<boolean>(
      dashboardsSelectors.selectDashboardInitialized,
    );

  // массив tab где tabId
  public readonly tabsSignal: Signal<Tab[]> = this.store.selectSignal<Tab[]>(
    dashboardsSelectors.selectTabs,
  );
  public readonly editTabId: Signal<string | null> = this.store.selectSignal<
    string | null
  >(dashboardsSelectors.selectEditTabId);
  public readonly tabTitleDraft: Signal<string> =
    this.store.selectSignal<string>(dashboardsSelectors.selectTabTitleDraft);

  public readonly dashboardIdRouteSignal: Signal<string | null> =
    this.routeIds.dashboardIdValid;

  public readonly selectedTabId: Signal<string | null> =
    this.routeIds.selectedTabId;

  public isAddTabOpenModal: WritableSignal<boolean> = signal<boolean>(false);

  public isDeleteOpenModal: WritableSignal<boolean> = signal<boolean>(false);
  public isDeleteTabOpenModal: WritableSignal<boolean> = signal<boolean>(false);
  public tabToDeleteId: WritableSignal<string | null> = signal<string | null>(
    null,
  );

  public readonly isEditMode: Signal<boolean> =
    this.store.selectSignal<boolean>(
      dashboardsSelectors.selectIsEditModeEnabled,
    );

  public readonly tabToDeleteName: Signal<string> = computed((): string => {
    const tabId: string | null = this.tabToDeleteId();
    if (isNullOrEmpty(tabId)) return "";

    const tab: Tab | undefined = this.tabsSignal().find(
      (tab: Tab): boolean => tab.id === tabId,
    );
    return tab?.title ?? "";
  });

  constructor() {
    effect((): void => {
      const dashboardId: string | null = this.routeIds.dashboardIdValid();
      if (isNonEmptyString(dashboardId)) {
        this.store.dispatch(dashboardActions.selectDashboard({ dashboardId }));
      }
    });
  }

  public onTabSelected(tabId: string): void {
    this.routeIds.selectTab(tabId);
  }

  public openDeleteModal(): void {
    if (this.isEditMode()) {
      return;
    }
    this.isDeleteOpenModal.set(true);
  }

  public openAddTabModal(): void {
    if (!this.isEditMode()) {
      return;
    }
    this.isAddTabOpenModal.set(true);
  }

  public onAddTabSubmit(title: string): void {
    this.store.dispatch(dashboardActions.TabActionsTitleMove.addTab({ title }));
    this.closeDelete();
  }

  public closeDelete(): void {
    this.isDeleteOpenModal.set(false);
    this.isAddTabOpenModal.set(false);
    this.isDeleteTabOpenModal.set(false);
    this.tabToDeleteId.set(null);
  }

  public onRemoveTab(): void {
    const id: string | null = this.tabToDeleteId();
    if (isNullOrEmpty(id)) return;
    this.store.dispatch(
      dashboardActions.TabActionsTitleMove.removeTab({ tabId: id }),
    );
    this.closeDelete();
    this.tabToDeleteId.set(null);
  }

  public onDelete(): void {
    const dashboardId = this.routeIds.dashboardIdRouteSignal();
    if (isNullOrEmpty(dashboardId)) {
      this.closeDelete();
      return;
    }

    this.handlerService
      .removeDashboard(dashboardId)
      .pipe(
        switchMap((nextIdAfterRemove) =>
          this.handlerService.loadDashboards().pipe(
            map(() => {
              const firstId =
                this.handlerService.dashboardsSignal()[0]?.id ?? null;
              return nextIdAfterRemove ?? firstId ?? null;
            }),
          ),
        ),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (nextId) => {
          this.closeDelete();
          if (nextId) {
            this.routeIds.selectDashboard(nextId);
          }
        },
      });
  }

  public onEditClick(): void {
    this.store.dispatch(dashboardActions.enterEditMode());
  }

  public onSave(): void {
    this.store.dispatch(dashboardActions.saveDashboard());
  }

  public onDiscard(): void {
    this.store.dispatch(dashboardActions.discardChanges());
  }

  public onStartTitleEdit(event: {
    tabId: string;
    currentTitle: string;
  }): void {
    this.store.dispatch(
      dashboardActions.TabActionsTitleMove.startTitleEdit(event),
    );
  }

  public onEndTitleEdit(): void {
    this.store.dispatch(dashboardActions.TabActionsTitleMove.endTitleEdit());
  }

  public onCommitTitleEdit(event: { tabId: string; newTitle: string }): void {
    this.store.dispatch(
      dashboardActions.TabActionsTitleMove.commitTitleEdit(event),
    );
  }

  public onReorderTab(event: {
    tabId: string;
    direction: "left" | "right";
  }): void {
    this.store.dispatch(
      dashboardActions.TabActionsTitleMove.reorderTab({
        tabId: event.tabId,
        direction: event.direction,
      }),
    );
  }

  public openRemoveTabModal(tabId: string): void {
    if (!this.isEditMode()) {
      return;
    }
    this.tabToDeleteId.set(tabId);
    this.isDeleteTabOpenModal.set(true);
  }
}

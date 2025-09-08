import { Component, computed, inject, signal } from '@angular/core';
import { CardListComponent } from '@/app/smart-home/components/card-list/card-list.component';
import * as SD from '@/app/store/selectors/selected-dashboard.selectors';
import { Store } from '@ngrx/store';
import { AppState } from '@/app/store/state/app.state';
import { RouteIdValidService } from '@/app/shared/services/route-id-valid.service';
import { ModalCreateCardComponent } from '@/app/smart-home/components/modal/modal-create-card/modal-create-card.component';

import * as A from '@/app/store/actions/dashboard.actions';
import { LayoutType } from '@/app/shared/models/data.model';

@Component({
  selector: 'app-dashboard-tab',
  imports: [CardListComponent, ModalCreateCardComponent],
  templateUrl: './dashboard-tab.component.html',
  styleUrl: './dashboard-tab.component.scss',
})
export class DashboardTabComponent {
  private store = inject<Store<AppState>>(Store);
  private readonly routeIds = inject(RouteIdValidService);

  readonly selectedTabId = this.routeIds.selectedTabId;

  readonly isAddCardOpenModal = signal<boolean>(false);

  readonly isEditMode = this.store.selectSignal<boolean>(
    SD.selectIsEditModeEnabled,
  );

  readonly cards = computed(() => {
    const tabId = this.selectedTabId();
    if (!tabId) return [];

    const selectCardsByTabId = SD.selectCardsByTabId(tabId);
    return this.store.selectSignal(selectCardsByTabId)();
  });

  openAddCardModal() {
    if (!this.isEditMode()) {
      return;
    }
    this.isAddCardOpenModal.set(true);
  }

  onAddCardSubmit({
    layout,
    title,
  }: {
    layout: LayoutType;
    title: string;
  }): void {
    const tabId = this.selectedTabId();
    if (!tabId) return;
    this.store.dispatch(
      A.TabActionsTitleMove.addCard({ tabId, layout, title }),
    );
    this.closeDelete();
  }

  closeDelete() {
    this.isAddCardOpenModal.set(false);
  }
}

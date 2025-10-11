import type { InputSignal, OnInit } from "@angular/core";
import { Component, inject, input } from "@angular/core";

import type { Card } from "@/app/shared/models/data.model";
import { CardComponent } from "@/app/smart-home/components/card/card.component";
import { AvailableItemsActions as devicesAction } from "@/app/store/actions/devices.actions";
import { Store } from "@ngrx/store";
import type { AppState } from "@/app/store/state/app.state";

@Component({
  selector: "app-card-list",
  standalone: true,
  imports: [CardComponent],
  templateUrl: "./card-list.component.html",
  styleUrl: "./card-list.component.scss",
})
export class CardListComponent implements OnInit {
  private readonly store: Store<AppState> = inject<Store<AppState>>(Store);

  public readonly cards: InputSignal<Card[]> = input<Card[]>([]);

  public ngOnInit(): void {
    this.store.dispatch(devicesAction.load());
  }
}

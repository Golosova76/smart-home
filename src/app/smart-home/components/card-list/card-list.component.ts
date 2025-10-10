import type { OnInit } from "@angular/core";
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
  private store = inject<Store<AppState>>(Store);

  cards = input<Card[]>([]);

  ngOnInit() {
    this.store.dispatch(devicesAction.load());
  }
}

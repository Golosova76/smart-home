import { Component, inject, input, OnInit } from '@angular/core';

import { Card } from '@/app/shared/models/data.model';
import { CardComponent } from '@/app/smart-home/components/card/card.component';
import { AvailableItemsActions as devicesAction } from '@/app/store/actions/devices.actions';
import { Store } from '@ngrx/store';
import { AppState } from '@/app/store/state/app.state';

@Component({
  selector: 'app-card-list',
  standalone: true,
  imports: [CardComponent],
  templateUrl: './card-list.component.html',
  styleUrl: './card-list.component.scss',
})
export class CardListComponent implements OnInit {
  private store = inject<Store<AppState>>(Store);

  cards = input<Card[]>([]);

  ngOnInit() {
    this.store.dispatch(devicesAction.load());
  }
}

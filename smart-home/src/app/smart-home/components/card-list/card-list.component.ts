import { Component, input } from '@angular/core';

import { Card } from '@/app/shared/models/data.model';
import { CardComponent } from '@/app/smart-home/components/card/card.component';

@Component({
  selector: 'app-card-list',
  standalone: true,
  imports: [CardComponent],
  templateUrl: './card-list.component.html',
  styleUrl: './card-list.component.scss',
})
export class CardListComponent {
  cards = input<Card[]>([]);
}

import {Component, input} from '@angular/core';

import {Tab} from '@/app/shared/models/data.model';

@Component({
  selector: 'app-tab-switcher',
  standalone: true,
  imports: [],
  templateUrl: './tab-switcher.component.html',
  styleUrl: './tab-switcher.component.scss'
})
export class TabSwitcherComponent {
  tabs = input<Tab[]>([]);

}

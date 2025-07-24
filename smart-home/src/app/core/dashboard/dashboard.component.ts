import { Component, OnInit } from '@angular/core';

import mockData from '@/app/shared/mock-data.json';
import { Card, DataModel, Tab } from '@/app/shared/models/data.model';
import { CardListComponent } from '@/app/smart-home/components/card-list/card-list.component';
import { TabSwitcherComponent } from '@/app/smart-home/components/tab-switcher/tab-switcher.component';

@Component({
  imports: [TabSwitcherComponent, CardListComponent],
  selector: 'app-dashboard',
  standalone: true,
  styleUrl: './dashboard.component.scss',
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  selectedTabId = '';
  //cards: Card[] = [];
  tabs: Tab[] = [];

  get cards(): Card[] {
    return this.tabs.find((tab) => tab.id === this.selectedTabId)?.cards || [];
  }

  ngOnInit() {
    const data = mockData as DataModel;
    this.tabs = data.tabs;

    //this.cards = this.tabs[0]?.cards || [];
    if (this.tabs.length > 0) {
      this.selectedTabId = this.tabs[0].id;
    }
  }

  onTabSelected(tabId: string) {
    this.selectedTabId = tabId;
  }
}

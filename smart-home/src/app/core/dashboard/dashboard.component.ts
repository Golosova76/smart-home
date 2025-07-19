import {Component, OnInit} from '@angular/core';

import mockData from '@/app/shared/mock-data.json'
import {DataModel, Tab} from '@/app/shared/models/data.model';
import {TabSwitcherComponent} from '@/app/smart-home/components/tab-switcher/tab-switcher.component';


@Component({
  imports: [TabSwitcherComponent],
  selector: 'app-dashboard',
  standalone: true,
  styleUrl: './dashboard.component.scss',
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  tabs: Tab[] = [];

  ngOnInit() {
    const data = mockData as DataModel;
    this.tabs = data.tabs;
  }
}

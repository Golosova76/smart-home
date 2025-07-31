import {Component, inject, OnInit} from '@angular/core';
import {DashboardService} from '@/app/shared/services/dashboard.service';
import {Dashboard} from '@/app/shared/models/dashboard.model';
import {DataModel} from '@/app/shared/models/data.model';
import {Router} from '@angular/router';

@Component({
  selector: 'app-sidebar-main',
  standalone: true,
  imports: [],
  templateUrl: './sidebar-main.component.html',
  styleUrl: './sidebar-main.component.scss',
})
export class SidebarMainComponent implements OnInit {
  dashboardService = inject(DashboardService);
  private router = inject(Router);

  readonly dashboards = this.dashboardService.dashboards;



  ngOnInit() {
    this.dashboardService.getDashboards().subscribe();
  }

  onDashboard(dashboard: Dashboard) {
    this.dashboardService.getDashboardById(dashboard.id ).subscribe({
      next: (data: DataModel)=> {
        if(data.tabs && data.tabs.length > 0){}
        const firstTabId = data.tabs[0].id;
        this.router.navigate(['/dashboard', dashboard.id ,firstTabId]).catch(() => {});
      }
    });
  }
}

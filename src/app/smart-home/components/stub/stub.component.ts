import type { WritableSignal } from "@angular/core";
import { Component, inject } from "@angular/core";
import { DashboardHandlerService } from "@/app/shared/services/dashboard-handler.service";
import type { Dashboard } from "@/app/shared/models/dashboard.model";

@Component({
  selector: "app-stub",
  imports: [],
  templateUrl: "./stub.component.html",
  styleUrl: "./stub.component.scss",
})
export class StubComponent {
  private readonly handlerService: DashboardHandlerService = inject(
    DashboardHandlerService,
  );

  public readonly dashboardsSignal: WritableSignal<Dashboard[]> =
    this.handlerService.dashboardsSignal;
}

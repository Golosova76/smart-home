import { Component, inject } from "@angular/core";
import { DashboardHandlerService } from "@/app/shared/services/dashboard-handler.service";

@Component({
  selector: "app-stub",
  imports: [],
  templateUrl: "./stub.component.html",
  styleUrl: "./stub.component.scss",
})
export class StubComponent {
  handlerService = inject(DashboardHandlerService);

  readonly dashboardsSignal = this.handlerService.dashboardsSignal;
}

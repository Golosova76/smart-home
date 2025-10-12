import type { InputSignal, OutputEmitterRef } from "@angular/core";
import { Component, input, output } from "@angular/core";

@Component({
  selector: "app-sidebar-header",
  standalone: true,
  imports: [],
  templateUrl: "./sidebar-header.component.html",
  styleUrl: "./sidebar-header.component.scss",
})
export class SidebarHeaderComponent {
  public readonly sidebarCollapsed: InputSignal<boolean> =
    input<boolean>(false);
  public menuClicked: OutputEmitterRef<void> = output<void>();
}

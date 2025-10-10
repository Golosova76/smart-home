import { Component, input, output } from "@angular/core";

@Component({
  selector: "app-sidebar-header",
  standalone: true,
  imports: [],
  templateUrl: "./sidebar-header.component.html",
  styleUrl: "./sidebar-header.component.scss",
})
export class SidebarHeaderComponent {
  sidebarCollapsed = input<boolean>(false);
  menuClicked = output<void>();
}

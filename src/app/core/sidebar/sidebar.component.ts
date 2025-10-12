import type { WritableSignal } from "@angular/core";
import { Component, HostBinding, signal } from "@angular/core";

import { SidebarFooterComponent } from "@/app/core/sidebar/sidebar-footer/sidebar-footer.component";
import { SidebarHeaderComponent } from "@/app/core/sidebar/sidebar-header/sidebar-header.component";
import { SidebarMainComponent } from "@/app/core/sidebar/sidebar-main/sidebar-main.component";

@Component({
  imports: [
    SidebarHeaderComponent,
    SidebarMainComponent,
    SidebarFooterComponent,
  ],
  selector: "app-sidebar",
  standalone: true,
  styleUrl: "./sidebar.component.scss",
  templateUrl: "./sidebar.component.html",
})
export class SidebarComponent {
  public readonly sidebarCollapsed: WritableSignal<boolean> =
    signal<boolean>(false);

  @HostBinding("class.collapsed")
  public get isCollapsed(): boolean {
    return this.sidebarCollapsed();
  }

  public toggleSidebar(): void {
    this.sidebarCollapsed.update((visible: boolean): boolean => !visible);
  }
}

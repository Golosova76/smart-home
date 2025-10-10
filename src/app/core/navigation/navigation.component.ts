import { Component, inject } from "@angular/core";

import { SidebarComponent } from "@/app/core/sidebar/sidebar.component";
import { RouterOutlet } from "@angular/router";
import { AuthService } from "@/app/core/auth/services/auth/auth.service";
import { AsyncPipe } from "@angular/common";

@Component({
  imports: [SidebarComponent, RouterOutlet, AsyncPipe],
  selector: "app-navigation",
  standalone: true,
  styleUrl: "./navigation.component.scss",
  templateUrl: "./navigation.component.html",
})
export class NavigationComponent {
  authService = inject(AuthService);

  isAuth$ = this.authService.isAuth$;
}

import { Component, inject } from "@angular/core";

import { SidebarComponent } from "@/app/core/sidebar/sidebar.component";
import { RouterOutlet } from "@angular/router";
import { AuthService } from "@/app/core/auth/services/auth/auth.service";
import { AsyncPipe } from "@angular/common";
import type { Observable } from "rxjs";
import { LoaderOverlayComponent } from "@/app/shared/components/loader-overlay/loader-overlay.component";

@Component({
  imports: [SidebarComponent, RouterOutlet, AsyncPipe],
  selector: "app-navigation",
  standalone: true,
  styleUrl: "./navigation.component.scss",
  templateUrl: "./navigation.component.html",
})
export class NavigationComponent {
  private readonly authService: AuthService = inject(AuthService);

  public isAuth$: Observable<boolean> = this.authService.isAuth$;
}

import { Component, inject, input, OnInit } from '@angular/core';
import { ProfileService } from '@/app/shared/services/profile.service';
import { AuthService } from '@/app/core/auth/services/auth/auth.service';

@Component({
  selector: 'app-sidebar-footer',
  standalone: true,
  imports: [],
  templateUrl: './sidebar-footer.component.html',
  styleUrl: './sidebar-footer.component.scss',
})
export class SidebarFooterComponent implements OnInit {
  profileService = inject(ProfileService);
  authService = inject(AuthService);

  sidebarCollapsed = input<boolean>(false);

  readonly profile = this.profileService.profile;

  ngOnInit() {
    this.profileService.getProfile().subscribe();
  }

  onLogout() {
    this.authService.logout();
  }
}

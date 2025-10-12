import type { CanActivateFn } from "@angular/router";
import { Router } from "@angular/router";
import { inject } from "@angular/core";
import { AuthService } from "@/app/core/auth/services/auth/auth.service";

export const authGuard: CanActivateFn = () => {
  const authService: AuthService = inject(AuthService);
  const router: Router = inject(Router);

  if (!authService.isAuthenticated()) {
    return router.createUrlTree(["/login"]);
  }
  return true;
};

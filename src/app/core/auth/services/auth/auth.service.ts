import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TokenService } from '@/app/core/auth/services/token/token.service';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import {
  LoginCredentials,
  TokenResponse,
} from '@/app/shared/models/login.model';
import { BASE_API_URL } from '@/app/shared/utils/constants';
import { Router } from '@angular/router';
import { ProfileService } from '@/app/shared/services/profile.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private tokenService = inject(TokenService);
  private router = inject(Router);
  private profileService = inject(ProfileService);

  private isAuthSubject = new BehaviorSubject<boolean>(
    this.tokenService.hasToken(),
  );

  isAuth$ = this.isAuthSubject.asObservable();

  login(credentials: LoginCredentials): Observable<TokenResponse> {
    return this.http
      .post<TokenResponse>(`${BASE_API_URL}user/login`, credentials)
      .pipe(
        tap((response) => {
          this.tokenService.setToken(response.token);
          this.isAuthSubject.next(true);
        }),
      );
  }

  logout() {
    this.tokenService.clearToken();
    this.isAuthSubject.next(false);
    this.profileService.clearProfile();
    this.router.navigate(['/login']).catch(() => {});
  }

  isAuthenticated(): boolean {
    return this.tokenService.hasToken();
  }
}

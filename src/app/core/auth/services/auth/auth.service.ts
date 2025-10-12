import { inject, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { TokenService } from "@/app/core/auth/services/token/token.service";
import type { Observable } from "rxjs";
import { BehaviorSubject, tap } from "rxjs";
import type {
  LoginCredentials,
  TokenResponse,
} from "@/app/shared/models/login.model";
import { BASE_API_URL } from "@/app/shared/utils/constants";
import { Router } from "@angular/router";
import { ProfileService } from "@/app/shared/services/profile.service";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private readonly http: HttpClient = inject(HttpClient);
  private readonly tokenService: TokenService = inject(TokenService);
  private readonly router: Router = inject(Router);
  private readonly profileService: ProfileService = inject(ProfileService);

  private isAuthSubject: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(this.tokenService.hasToken());

  public isAuth$: Observable<boolean> = this.isAuthSubject.asObservable();

  public login(credentials: LoginCredentials): Observable<TokenResponse> {
    return this.http
      .post<TokenResponse>(`${BASE_API_URL}user/login`, credentials)
      .pipe(
        tap((response: TokenResponse): void => {
          this.tokenService.setToken(response.token);
          this.isAuthSubject.next(true);
        }),
      );
  }

  public logout(): void {
    this.tokenService.clearToken();
    this.isAuthSubject.next(false);
    this.profileService.clearProfile();
    this.router.navigate(["/login"]).catch((): void => {});
  }

  public isAuthenticated(): boolean {
    return this.tokenService.hasToken();
  }
}

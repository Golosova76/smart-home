import type {
  HttpErrorResponse,
  HttpInterceptorFn,
  HttpRequest,
} from "@angular/common/http";
import { inject } from "@angular/core";
import { TokenService } from "@/app/core/auth/services/token/token.service";
import { Router } from "@angular/router";
import type { Observable } from "rxjs";
import { catchError, throwError } from "rxjs";
import { isNullOrEmpty } from "@/app/shared/utils/is-null-or-empty";
import { UNAUTHENTIC_STATUS_CODE } from "@/app/shared/utils/constants";

export const authInterceptor: HttpInterceptorFn = (
  request: HttpRequest<unknown>,
  next,
) => {
  const tokenService: TokenService = inject(TokenService);
  const router: Router = inject(Router);

  let modifiedRequest: HttpRequest<unknown> = request;

  //добавление token к headers
  const token: string | null = tokenService.getToken();
  if (!isNullOrEmpty(token)) {
    modifiedRequest = modifiedRequest.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // обработка  error 401
  return next(modifiedRequest).pipe(
    catchError((error: HttpErrorResponse): Observable<never> => {
      if (error.status === UNAUTHENTIC_STATUS_CODE) {
        tokenService.clearToken();
        router.navigate(["/login"]).catch((): void => {});
      }
      return throwError((): HttpErrorResponse => error);
    }),
  );
};

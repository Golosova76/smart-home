import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { TokenService } from '@/app/core/auth/services/token/token.service';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const tokenService = inject(TokenService);
  const router = inject(Router);

  let modifiedRequest = request;

  //добавление token к headers
  const token = tokenService.getToken();
  if (token) {
    modifiedRequest = modifiedRequest.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // обработка  error 401
  return next(modifiedRequest).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        tokenService.clearToken();
        router.navigate(['/login']).catch(() => {});
      }
      return throwError(() => error);
    }),
  );
};

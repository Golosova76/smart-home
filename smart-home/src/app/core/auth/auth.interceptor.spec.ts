import { TestBed } from '@angular/core/testing';
import { HttpInterceptorFn } from '@angular/common/http';

import { authInterceptor } from './auth.interceptor';

describe('authInterceptor', () => {
  // eslint-disable-next-line unicorn/consistent-function-scoping
  const interceptor: HttpInterceptorFn = (request, next) =>
    TestBed.runInInjectionContext(() => authInterceptor(request, next));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });
});

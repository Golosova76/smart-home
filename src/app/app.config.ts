import type { ApplicationConfig } from "@angular/core";
import {
  isDevMode,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from "@angular/core";
import { provideRouter } from "@angular/router";

import { routes } from "./app.routes";
import {
  provideHttpClient,
  withFetch,
  withInterceptors,
} from "@angular/common/http";
import { authInterceptor } from "@/app/core/auth/auth.interceptor";
import { provideState, provideStore } from "@ngrx/store";
import { provideEffects } from "@ngrx/effects";
import { provideStoreDevtools } from "@ngrx/store-devtools";
import { selectedDashboardFeature } from "@/app/store/reducers/dashboard.reducer";
import { SelectedDashboardEffects } from "@/app/store/effects/selected-dashboard.effects";
import { availableItemsFeature } from "@/app/store/reducers/devices.reducer";

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideHttpClient(withFetch(), withInterceptors([authInterceptor])),
    provideStore(),
    provideState(selectedDashboardFeature),
    provideState(availableItemsFeature),
    provideEffects(SelectedDashboardEffects),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode(), trace: true }),
  ],
};

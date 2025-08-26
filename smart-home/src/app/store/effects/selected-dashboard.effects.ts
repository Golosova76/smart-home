import {inject, Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {DashboardService} from '@/app/shared/services/dashboard.service';
import * as A from '@/app/store/actions/dashboard.actions'
import {catchError, map, of, switchMap} from 'rxjs';

@Injectable()
export class SelectedDashboardEffects {
  private readonly actions$ = inject(Actions);
  private readonly api = inject(DashboardService);

  readonly loadSelectedDashboard$ = createEffect(() =>
    this.actions$.pipe(
      ofType(A.selectDashboard),
      switchMap(({ dashboardId }) =>
      this.api.getDashboardById(dashboardId).pipe(
        map((data) => A.loadSelectedDashboardSuccess({ data })),
        catchError(error =>
          of(A.loadSelectedDashboardFailure({ error })))
      ))
    )
  )
}

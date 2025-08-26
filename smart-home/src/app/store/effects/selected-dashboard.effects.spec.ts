import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';

import { SelectedDashboardEffects } from './selected-dashboard.effects';

describe('SelectedDashboardEffects', () => {
  let actions$: Observable<any>;
  let effects: SelectedDashboardEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SelectedDashboardEffects,
        provideMockActions(() => actions$)
      ]
    });

    effects = TestBed.inject(SelectedDashboardEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});

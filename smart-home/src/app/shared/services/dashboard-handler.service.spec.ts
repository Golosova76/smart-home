import { TestBed } from '@angular/core/testing';

import { DashboardHandlerService } from './dashboard-handler.service';

describe('DashboardHandlerService', () => {
  let service: DashboardHandlerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DashboardHandlerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

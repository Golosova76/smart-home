import { TestBed } from "@angular/core/testing";

import { RouteIdValidService } from "./route-id-valid.service";

describe("RouteIdValidService", () => {
  let service: RouteIdValidService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RouteIdValidService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});

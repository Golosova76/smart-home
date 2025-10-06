import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalCreateDashboardsComponent } from './modal-create-dashboards.component';

describe('ModalCreateDashboardsComponent', () => {
  let component: ModalCreateDashboardsComponent;
  let fixture: ComponentFixture<ModalCreateDashboardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalCreateDashboardsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalCreateDashboardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

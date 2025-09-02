import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalCreateTabsComponent } from './modal-create-tabs.component';

describe('ModalCreateTabsComponent', () => {
  let component: ModalCreateTabsComponent;
  let fixture: ComponentFixture<ModalCreateTabsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalCreateTabsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalCreateTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

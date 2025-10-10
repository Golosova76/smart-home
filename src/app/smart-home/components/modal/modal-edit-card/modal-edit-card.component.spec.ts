import type { ComponentFixture } from "@angular/core/testing";
import { TestBed } from "@angular/core/testing";

import { ModalEditCardComponent } from "./modal-edit-card.component";

describe("ModalEditCardComponent", () => {
  let component: ModalEditCardComponent;
  let fixture: ComponentFixture<ModalEditCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalEditCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalEditCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});

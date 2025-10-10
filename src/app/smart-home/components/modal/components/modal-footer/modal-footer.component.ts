import {
  Component,
  input,
  type InputSignal,
  output,
  type OutputEmitterRef,
} from "@angular/core";
import type {
  EntityActions,
  FooterVariant,
} from "@/app/shared/models/dashboard.model";

@Component({
  selector: "app-modal-footer",
  imports: [],
  templateUrl: "./modal-footer.component.html",
  styleUrl: "./modal-footer.component.scss",
})
export class ModalFooterComponent {
  public entityActions: InputSignal<EntityActions | undefined> =
    input<EntityActions>();
  public disabled: InputSignal<boolean> = input<boolean>(false);

  protected readonly closed: OutputEmitterRef<void> = output<void>();
  protected readonly delete: OutputEmitterRef<void> = output<void>();
  protected readonly submitFooter: OutputEmitterRef<void> = output<void>();

  protected readonly variant: InputSignal<FooterVariant> =
    input<FooterVariant>("form");

  public get buttonAction(): string {
    return `${this.entityActions()}`;
  }

  public closeModal(): void {
    this.closed.emit();
  }
  public onDelete(): void {
    this.delete.emit();
  }

  public onSubmit(): void {
    this.submitFooter.emit(); // Эмитим событие submit
  }
}

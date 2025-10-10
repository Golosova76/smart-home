import {
  Component,
  input,
  type InputSignal,
  output,
  type OutputEmitterRef,
} from "@angular/core";
import type {
  EntityActions,
  EntityDelete,
} from "@/app/shared/models/dashboard.model";

@Component({
  selector: "app-modal-header",
  imports: [],
  templateUrl: "./modal-header.component.html",
  styleUrl: "./modal-header.component.scss",
})
export class ModalHeaderComponent {
  public entityDelete: InputSignal<EntityDelete | undefined> =
    input<EntityDelete>();
  public entityActions: InputSignal<EntityActions | undefined> =
    input<EntityActions>();

  protected readonly closed: OutputEmitterRef<void> = output<void>();

  public get heading(): string {
    return `${this.entityActions()} ${this.entityDelete()}`;
  }

  public closeModal(): void {
    this.closed.emit();
  }
}

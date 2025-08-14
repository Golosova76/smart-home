import {Component, input, output} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ModalShellComponent} from '@/app/smart-home/components/modal/modal-shell/modal-shell.component';
import {EntityDelete} from '@/app/shared/models/dashboard.model';

@Component({
  selector: 'app-modal-confirm-delete',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    ModalShellComponent
  ],
  templateUrl: './modal-confirm-delete.component.html',
  styleUrl: './modal-confirm-delete.component.scss'
})
export class ModalConfirmDeleteComponent {
  entityDelete = input.required<EntityDelete>();
  labelDelete = input.required<string>();

  closed = output<void>();
  deleted = output<void>();

  get heading(): string {
    return `Delete ${this.entityDelete()}`;
  }

  get message(): string {
    return `This will delete the ${this.entityDelete()} ${this.labelDelete()}`;
  }


  closeModal() {
    this.closed.emit();
  }

  onDelete() {
    this.deleted.emit();
  }
}

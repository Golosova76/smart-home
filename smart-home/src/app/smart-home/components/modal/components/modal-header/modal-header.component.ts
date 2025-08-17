import { Component, input, output } from '@angular/core';
import {
  EntityActions,
  EntityDelete,
} from '@/app/shared/models/dashboard.model';

@Component({
  selector: 'app-modal-header',
  imports: [],
  templateUrl: './modal-header.component.html',
  styleUrl: './modal-header.component.scss',
})
export class ModalHeaderComponent {
  entityDelete = input.required<EntityDelete>();
  entityActions = input.required<EntityActions>();

  closed = output<void>();

  get heading(): string {
    return `${this.entityActions()} ${this.entityDelete()}`;
  }

  closeModal() {
    this.closed.emit();
  }
}

import {Component, input, output} from '@angular/core';
import {EntityActions, FooterVariant} from '@/app/shared/models/dashboard.model';

@Component({
  selector: 'app-modal-footer',
  imports: [],
  templateUrl: './modal-footer.component.html',
  styleUrl: './modal-footer.component.scss'
})
export class ModalFooterComponent {
  entityActions = input<EntityActions>();
  disabled = input<boolean>(false);

  closed = output<void>();
  delete = output<void>();
  submit = output<void>();

  variant = input<FooterVariant>('form');

  get buttonAction(): string {
    return `${this.entityActions()}`;
  }

  closeModal() {
    this.closed.emit();
  }
  onDelete() {
    this.delete.emit();
  }

  onSubmit() {
    this.submit.emit(); // Эмитим событие submit
  }
}

import {Component, input, output} from '@angular/core';
import {EntityActions} from '@/app/shared/models/dashboard.model';

@Component({
  selector: 'app-modal-footer',
  imports: [],
  templateUrl: './modal-footer.component.html',
  styleUrl: './modal-footer.component.scss'
})
export class ModalFooterComponent {
  entityActions = input.required<EntityActions>();
  formId = input.required<string>();

  closed = output<void>();
  disabled = input<boolean>(false);

  get buttonAction(): string {
    return `${this.entityActions()}`;
  }

  closeModal() {
    this.closed.emit();
  }

}

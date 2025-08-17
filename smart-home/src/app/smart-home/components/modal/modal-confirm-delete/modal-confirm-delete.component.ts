import {Component, input, output} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ModalShellComponent} from '@/app/smart-home/components/modal/modal-shell/modal-shell.component';
import {EntityDelete} from '@/app/shared/models/dashboard.model';
import {ModalHeaderComponent} from '@/app/smart-home/components/modal/components/modal-header/modal-header.component';
import {ModalFooterComponent} from '@/app/smart-home/components/modal/components/modal-footer/modal-footer.component';
import {UpperFirstPipe} from '@/app/shared/pipes/upper-first.pipe';

@Component({
  selector: 'app-modal-confirm-delete',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    ModalShellComponent,
    ModalHeaderComponent,
    ModalFooterComponent,
    UpperFirstPipe,
  ],
  templateUrl: './modal-confirm-delete.component.html',
  styleUrl: './modal-confirm-delete.component.scss',
})
export class ModalConfirmDeleteComponent {
  entityDelete = input<EntityDelete>();
  labelDelete = input<string>();

  closed = output<void>();
  deleted = output<void>();

  onDeleted() {
    this.deleted.emit();
  }
}

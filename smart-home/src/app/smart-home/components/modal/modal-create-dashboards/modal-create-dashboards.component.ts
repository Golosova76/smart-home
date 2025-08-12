import { Component } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

@Component({
  selector: 'app-modal-create-dashboards',
  imports: [
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './modal-create-dashboards.component.html',
  styleUrl: './modal-create-dashboards.component.scss'
})
export class ModalCreateDashboardsComponent {

}

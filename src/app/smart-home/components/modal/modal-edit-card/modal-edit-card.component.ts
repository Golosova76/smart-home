import { Component, inject, input, output } from "@angular/core";
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from "@angular/forms";
import type {
  Device,
  LayoutType,
  Sensor,
} from "@/app/shared/models/data.model";
import * as devicesSelectors from "@/app/store/selectors/devices.selectors";
import { Store } from "@ngrx/store";
import type { AppState } from "@/app/store/state/app.state";

@Component({
  selector: "app-modal-edit-card",
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: "./modal-edit-card.component.html",
  styleUrl: "./modal-edit-card.component.scss",
})
export class ModalEditCardComponent {
  private store = inject<Store<AppState>>(Store);

  disabled = input<boolean>(false);

  closed = output<void>();
  deleted = output<void>();
  submitted = output<{ deviceId: string | null; sensorId: string | null }>();

  readonly currentTitle = input<string>("");
  readonly layout = input<LayoutType>();

  readonly devices = this.store.selectSignal<Device[]>(
    devicesSelectors.selectDevices,
  );
  readonly sensors = this.store.selectSignal<Sensor[]>(
    devicesSelectors.selectSensors,
  );

  readonly form = new FormGroup({
    title: new FormControl<string>(""),
    deviceId: new FormControl<string | null>(null),
    sensorId: new FormControl<string | null>(null),
  });

  closeModal() {
    this.closed.emit();
  }

  onDelete() {
    this.deleted.emit();
  }

  onSubmit() {
    const { deviceId, sensorId } = this.form.getRawValue();

    this.submitted.emit({ deviceId, sensorId });
  }
}

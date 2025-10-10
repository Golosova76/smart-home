import type { InputSignal, OutputEmitterRef, Signal } from "@angular/core";
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
  public form = new FormGroup({
    title: new FormControl<string>(""),
    deviceId: new FormControl<string | null>(null),
    sensorId: new FormControl<string | null>(null),
  });

  protected readonly store: Store<AppState> = inject<Store<AppState>>(Store);

  protected readonly disabled: InputSignal<boolean> = input<boolean>(false);

  protected readonly closed: OutputEmitterRef<void> = output<void>();
  protected readonly submitted = output<{
    deviceId: string | null;
    sensorId: string | null;
  }>();

  protected readonly currentTitle: InputSignal<string> = input<string>("");
  protected readonly layout: InputSignal<LayoutType | undefined> =
    input<LayoutType>();

  protected readonly devices: Signal<Device[]> = this.store.selectSignal<
    Device[]
  >(devicesSelectors.selectDevices);
  protected readonly sensors: Signal<Sensor[]> = this.store.selectSignal<
    Sensor[]
  >(devicesSelectors.selectSensors);

  public closeModal(): void {
    this.closed.emit();
  }

  public onSubmit(): void {
    const { deviceId, sensorId } = this.form.getRawValue();

    this.submitted.emit({ deviceId, sensorId });
  }
}

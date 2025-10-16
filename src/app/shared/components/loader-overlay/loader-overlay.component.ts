import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "app-loader-overlay",
  imports: [],
  templateUrl: "./loader-overlay.component.html",
  styleUrl: "./loader-overlay.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoaderOverlayComponent {}

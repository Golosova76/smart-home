import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { NavigationComponent } from '@/app/core/navigation/navigation.component';

@Component({
  imports: [RouterOutlet, NavigationComponent],
  selector: 'app-root',
  styleUrl: './app.component.scss',
  templateUrl: './app.component.html',
})
export class AppComponent {
  protected readonly title = signal('smart-home');
}

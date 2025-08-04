import { Component, Input } from '@angular/core';

@Component({
  selector: 'svg[icon]',
  standalone: true,
  template: '<svg:use [attr.href]="href"></svg:use>',
})
export class SvgIconComponent {
  @Input() icon = '';

  get href() {
    return `assets/image/svg/${this.icon}.svg#${this.icon}`;
  }
}

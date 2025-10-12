import type { EffectRef, Signal, WritableSignal } from "@angular/core";
import { effect, inject, Component, HostBinding, signal } from "@angular/core";

import { SidebarFooterComponent } from "@/app/core/sidebar/sidebar-footer/sidebar-footer.component";
import { SidebarHeaderComponent } from "@/app/core/sidebar/sidebar-header/sidebar-header.component";
import { SidebarMainComponent } from "@/app/core/sidebar/sidebar-main/sidebar-main.component";
import { toSignal } from "@angular/core/rxjs-interop";
import type { BreakpointState } from "@angular/cdk/layout";
import { BreakpointObserver, Breakpoints } from "@angular/cdk/layout";
import { map } from "rxjs";

@Component({
  imports: [
    SidebarHeaderComponent,
    SidebarMainComponent,
    SidebarFooterComponent,
  ],
  selector: "app-sidebar",
  standalone: true,
  styleUrl: "./sidebar.component.scss",
  templateUrl: "./sidebar.component.html",
})
export class SidebarComponent {
  private readonly breakpointObserver: BreakpointObserver =
    inject(BreakpointObserver);

  // true — tablet/mobile (<1024), false — desktop (>=1024)
  private readonly isNarrow: Signal<boolean> = toSignal(
    this.breakpointObserver
      .observe([Breakpoints.Handset, Breakpoints.Tablet])
      .pipe(map((state: BreakpointState): boolean => state.matches)),
    { initialValue: false },
  );

  public readonly sidebarCollapsed: WritableSignal<boolean> =
    signal<boolean>(false);
  // Пользователь вручную менял состояние после текущего определения брейкпоинта
  private readonly userOverrode: WritableSignal<boolean> =
    signal<boolean>(false);
  // Текущее «значение» брейкпоинта, чтобы отлавливать смену (desktop - mobile)
  private lastIsNarrow: boolean = this.isNarrow();

  // Авто-режим: при переходе через 1024 — выставляем дефолт и сбрасываем override
  private readonly syncToBreakpoint: EffectRef = effect((): void => {
    const narrow: boolean = this.isNarrow();
    if (narrow !== this.lastIsNarrow) {
      // произошло переключение desktop↔mobile
      this.sidebarCollapsed.set(narrow); // <1024 скрываем, ≥1024 показываем
      this.userOverrode.set(false); // сбрасываем ручной override
      this.lastIsNarrow = narrow;
    } else if (!this.userOverrode()) {
      // первичная инициализация (первый проход) — тоже применим дефолт
      this.sidebarCollapsed.set(narrow);
    }
  });

  @HostBinding("class.collapsed")
  public get isCollapsed(): boolean {
    return this.sidebarCollapsed();
  }

  public toggleSidebar(): void {
    this.sidebarCollapsed.update((visible: boolean): boolean => !visible);
  }
}

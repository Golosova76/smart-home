import type { WritableSignal } from "@angular/core";
import { Injectable, signal } from "@angular/core";
import type {
  ChannelState,
  LoadingChannel,
} from "@/app/shared/models/loading.model";
import {
  DEFAULT_MIN_VISIBLE_MS,
  DEFAULT_SHOW_AFTER_MS,
  LOADING_DEFAULT_POLICY,
  LOADING_CHANNELS,
} from "@/app/shared/models/loading.model";

@Injectable({
  providedIn: "root",
})
export class LoadingService {
  private readonly channelStates = new Map<LoadingChannel, ChannelState>(
    LOADING_CHANNELS.map((channel) => [
      channel,
      {
        activeRequestsCount: 0,
        isVisible: signal(false),
        visibleSinceTimestamp: null,
        showTimerId: null,
        hideTimerId: null,
      },
    ]),
  );

  private getChannelState(channel: LoadingChannel): ChannelState {
    const state = this.channelStates.get(channel);
    if (!state) {
      throw new Error(`Unknown loading channel: ${String(channel)}`);
    }
    return state;
  }

  private hideImmediately(state: ChannelState): void {
    state.isVisible.set(false);
    state.visibleSinceTimestamp = null;

    // Сначала отменим запланированное скрытие, если стояло
    if (state.hideTimerId != null) {
      clearTimeout(state.hideTimerId);
      state.hideTimerId = null;
    }

    if (state.showTimerId != null) {
      clearTimeout(state.showTimerId);
      state.showTimerId = null;
    }
  }

  private finish(channel: LoadingChannel): void {
    const state = this.getChannelState(channel);
    state.activeRequestsCount = Math.max(0, state.activeRequestsCount - 1);

    // Если ещё есть активные запросы — ничего не скрываем
    if (state.activeRequestsCount > 0) return;

    // Активных запросов больше нет
    if (!state.isVisible()) {
      // Спиннер не успели показать — отменяем запланированный показ
      if (state.showTimerId != null) {
        clearTimeout(state.showTimerId);
        state.showTimerId = null;
      }
      return;
    }

    // Спиннер виден — соблюдаем минимальное время
    const visibleSince = state.visibleSinceTimestamp ?? Date.now();
    const elapsedMilliseconds = Date.now() - visibleSince;
    const minVisibleMilliseconds =
      LOADING_DEFAULT_POLICY.minVisibleMs ?? DEFAULT_MIN_VISIBLE_MS;

    const remainingMilliseconds = Math.max(
      0,
      minVisibleMilliseconds - elapsedMilliseconds,
    );

    if (remainingMilliseconds === 0) {
      this.hideImmediately(state);
    } else {
      if (state.hideTimerId != null) clearTimeout(state.hideTimerId);
      state.hideTimerId = globalThis.setTimeout(() => {
        this.hideImmediately(state);
        state.hideTimerId = null;
      }, remainingMilliseconds);
    }
  }

  public begin(channel: LoadingChannel): () => void {
    const state: ChannelState = this.getChannelState(channel);

    state.activeRequestsCount += 1;

    // Если индикатор уже виден и был запланирован hide — отменяем hide
    if (state.isVisible() && state.hideTimerId != null) {
      clearTimeout(state.hideTimerId);
      state.hideTimerId = null;
    }

    // Показываем только на переходе 0 → 1
    if (
      state.activeRequestsCount === 1 && // Если индикатор ещё не виден и таймер показа ещё не стоит — ставим
      !state.isVisible() &&
      state.showTimerId == null
    ) {
      const showAfterMilliseconds =
        LOADING_DEFAULT_POLICY.showAfterMs ?? DEFAULT_SHOW_AFTER_MS;

      state.showTimerId = globalThis.setTimeout(() => {
        // Показать только если по-прежнему есть активные запросы
        if (state.activeRequestsCount > 0 && !state.isVisible()) {
          state.isVisible.set(true);
          state.visibleSinceTimestamp = Date.now();
        }
        state.showTimerId = null;
      }, showAfterMilliseconds);
    }

    // Возвращаем idempotent-завершалку
    let isAlreadyFinished = false;
    return () => {
      if (isAlreadyFinished) return;
      isAlreadyFinished = true;
      this.finish(channel);
    };
  }

  /** Доступ к сигналу видимости индикатора по каналу. */
  public visible(channel: LoadingChannel): WritableSignal<boolean> {
    return this.getChannelState(channel).isVisible;
  }
}

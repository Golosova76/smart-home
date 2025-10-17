import type { WritableSignal } from "@angular/core";

export const LOADING_CHANNELS = ["dashboard", "dashboards", "user"] as const;

export const DEFAULT_SHOW_AFTER_MS = 300;
export const DEFAULT_MIN_VISIBLE_MS = 500;

export type LoadingChannel = (typeof LOADING_CHANNELS)[number];

export interface LoadingPolicy {
  showAfterMs: number;
  minVisibleMs: number;
}

export const LOADING_DEFAULT_POLICY: LoadingPolicy = {
  showAfterMs: DEFAULT_SHOW_AFTER_MS,
  minVisibleMs: DEFAULT_MIN_VISIBLE_MS,
};

export interface ChannelState {
  activeRequestsCount: number;
  isVisible: WritableSignal<boolean>;
  visibleSinceTimestamp: number | null;
  showTimerId: ReturnType<typeof setTimeout> | null;
  hideTimerId: ReturnType<typeof setTimeout> | null;
}

/**
 * Порядок ВАЖЕН:
 * 1) Детали даша (/api/dashboards/:id) → dashboard
 * 2) Список дашей (/api/dashboards)    → dashboards
 * 3) Профиль пользователя              → user
 */
export const CHANNEL_MAP: Array<[RegExp, LoadingChannel]> = [
  [/\/api\/dashboards\/[^/]+(?:\/|$)/i, "dashboard"], // один даш
  [/\/api\/dashboards\/?$/i, "dashboards"], // список
  [/\/api\/user\/profile(?:\/|$)/i, "user"], // профиль
];

export function resolveChannelByUrl(url: string): LoadingChannel | null {
  const path: string = url.split("?")[0]?.split("#")[0] ?? url;
  for (const [rx, channel] of CHANNEL_MAP) {
    if (rx.test(path)) return channel;
  }
  return null;
}

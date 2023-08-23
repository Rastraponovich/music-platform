import type { Band, MediaStatus, TWinampState, WinampWindow } from "@/features/music/types";

export const BANDS: Band[] = [60, 170, 310, 600, 1000, 3000, 6000, 12000, 14000, 16000];

export const MEDIA_STATUS: Record<MediaStatus, MediaStatus> = {
  PAUSED: "PAUSED",
  PLAYING: "PLAYING",
  STOPPED: "STOPPED",
};

export const WINAMP_STATE: Record<TWinampState, TWinampState> = {
  CREATED: "CREATED",
  INIT: "INIT",
  TRACKLOADED: "TRACKLOADED",
  DESTROYED: "DESTROYED",
  CLOSED: "CLOSED",
  OPENED: "OPENED",
  MINIMIZED: "MINIMIZED",
};

export const WINAMP_WINDOW_STATE: Record<WinampWindow, WinampWindow> = {
  EQUALIZER: "EQUALIZER",
  NONE: "NONE",
  PLAYER: "PLAYER",
  PLAYLIST: "PLAYLIST",
  PRESETS: "PRESETS",
};

import type { Band, MediaStatus, TWinampState, WinampWindow } from "../songs";

export const BANDS: Band[] = [60, 170, 310, 600, 1000, 3000, 6000, 12000, 14000, 16000];

export enum TimeMode {
  ELAPSED = "ELAPSED",
  REMAINING = "REMAINING",
}

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

export const BASE_SKIN_COLORS = [
  "rgb(0,0,0)",
  "rgb(24,33,41)",
  "rgb(239,49,16)",
  "rgb(206,41,16)",
  "rgb(214,90,0)",
  "rgb(214,102,0)",
  "rgb(214,115,0)",
  "rgb(198,123,8)",
  "rgb(222,165,24)",
  "rgb(214,181,33)",
  "rgb(189,222,41)",
  "rgb(148,222,33)",
  "rgb(41,206,16)",
  "rgb(50,190,16)",
  "rgb(57,181,16)",
  "rgb(49,156,8)",
  "rgb(41,148,0)",
  "rgb(24,132,8)",
  "rgb(255,255,255)",
  "rgb(214,214,222)",
  "rgb(181,189,189)",
  "rgb(160,170,175)",
  "rgb(148,156,165)",
  "rgb(150,150,150)",
];

export enum WinampWindowState {
  EQUALIZER = "EQUALIZER",
  NONE = "NONE",
  PLAYER = "PLAYER",
  PLAYLIST = "PLAYLIST",
  PRESETS = "PRESETS",
}

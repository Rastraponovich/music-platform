import {
  Band,
  TPreset,
  PresetTypes,
  TMediaStatus,
  TVISUALIZERS,
  TWinampState,
  TWinampWindow,
  UseDraggblePosition,
} from "./types";

export const VISUALIZERS: TVISUALIZERS = {
  OSCILLOSCOPE: "OSCILLOSCOPE",
  BAR: "BAR",
  NONE: "NONE",
  MILKDROP: "MILKDROP",
};

export const VISUALIZER_ORDER = [VISUALIZERS.BAR, VISUALIZERS.OSCILLOSCOPE, VISUALIZERS.NONE];
export const BANDS: Band[] = [60, 170, 310, 600, 1000, 3000, 6000, 12000, 14000, 16000];

export const MEDIA_STATUS: Record<TMediaStatus, TMediaStatus> = {
  PAUSED: "PAUSED",
  PLAYING: "PLAYING",
  STOPPED: "STOPPED",
};

export const WINAMP_PLAYER_STATE: Record<TMediaStatus, TMediaStatus> = {
  PAUSED: "PAUSED",
  PLAYING: "PLAYING",
  STOPPED: "STOPPED",
};

export enum PlayerState {
  PAUSED = "PAUSED",
  PLAYING = "PLAYING",
  STOPPED = "STOPPED",
}

export enum WinampState {
  CREATED = "CREATED",
  INIT = "INIT",
  TRACKLOADED = "TRACKLOADED",
  DESTROYED = "DESTROYED",
  CLOSED = "CLOSED",
  OPENED = "OPENED",
  MINIMIZED = "MINIMIZED",
}

export const WINAMP_STATE: Record<TWinampState, TWinampState> = {
  CREATED: "CREATED",
  INIT: "INIT",
  TRACKLOADED: "TRACKLOADED",
  DESTROYED: "DESTROYED",
  CLOSED: "CLOSED",
  OPENED: "OPENED",
  MINIMIZED: "MINIMIZED",
};

export const WINAMP_WINDOW_STATE: Record<TWinampWindow, TWinampWindow> = {
  EQUALIZER: "EQUALIZER",
  NONE: "NONE",
  PLAYER: "PLAYER",
  PLAYLIST: "PLAYLIST",
  PRESETS: "PRESETS",
};
export const DEFALUT_WINDOW_STATE: Record<TWinampWindow, UseDraggblePosition> = {
  PLAYER: {
    clientX: "1rem",
    clientY: "95px",
  },
  EQUALIZER: {
    clientX: "1rem",
    clientY: "211px",
  },
  PLAYLIST: {
    clientX: "1rem",
    clientY: "327px",
  },
  NONE: {
    clientX: "unset",
    clientY: "unset",
  },
  PRESETS: {
    clientX: "300px",
    clientY: "unset",
  },
};

const DEFAULT_PRESET: TPreset = {
  name: "DEFAULT",
  value: {
    "60": 50, //0
    "170": 50, //0
    "310": 50, //0
    "600": 50, //0
    "1000": 50, //0
    "3000": 50, //0
    "6000": 50, //0
    "12000": 50, //0
    "14000": 50, //0
    "16000": 50, //0
  },
};

const ROCK_PRESET: TPreset = {
  name: "ROCK",
  value: {
    "60": 70, //4.8
    "170": 62, //2,9
    "310": 35, //-3.6
    "600": 29, //-5.1
    "1000": 40, //-2.5
    "3000": 62, // 2.5
    "6000": 73, //5.5
    "12000": 78, //6.7
    "14000": 78, //6.7
    "16000": 78, //6.7
  },
};

const TECHNO_PRESET: TPreset = {
  name: "TECHNO",
  value: {
    "60": 70, //4.8
    "170": 65, //3.6
    "310": 50, // 0
    "600": 35, // -3.6
    "1000": 37, // -3.2
    "3000": 50, // 0
    "6000": 70, //4.8
    "12000": 75, //5,9
    "14000": 75, //5.9
    "16000": 73, //5.5
  },
};

const CLUB_PRESET: TPreset = {
  name: "CLUB",
  value: {
    "60": 50, //0
    "170": 50, //0
    "310": 62, // 2.5
    "600": 65, // 3.6
    "1000": 65, // 3.6
    "3000": 65, // 3.6
    "6000": 62, //2.5
    "12000": 50, //0
    "14000": 50, //0
    "16000": 50, //0
  },
};

const FULL_BASS_PRESET: TPreset = {
  name: "FULL BASS",
  value: {
    "60": 75, //5.9
    "170": 75, //5.9
    "310": 75, // 5.9
    "600": 65, // 3.6
    "1000": 54, // 1
    "3000": 38, // -2.9
    "6000": 27, // -5.5
    "12000": 23, //-6,3
    "14000": 21, //-7
    "16000": 21, //-7
  },
};

const FULL_BASS_TREBLE_PRESET: TPreset = {
  name: "FULL BASS AND TREBBLE",
  value: {
    "60": 68, //4.4
    "170": 65, //3.6
    "310": 50, // 0
    "600": 30, // -4,8
    "1000": 38, // -2.9
    "3000": 54, // 1
    "6000": 71, // 5.1
    "12000": 78, //6.7
    "14000": 81, //7.4
    "16000": 81, //7.4
  },
};

export const PRESETS: Record<PresetTypes, TPreset> = {
  DEFAULT: DEFAULT_PRESET,
  ROCK: ROCK_PRESET,
  CLASSIC: DEFAULT_PRESET,
  TECHNO: TECHNO_PRESET,
  CLUB: CLUB_PRESET,
  "FULL BASS": FULL_BASS_PRESET,
  "FULL BASS AND TREBBLE": FULL_BASS_TREBLE_PRESET,
};

export const PRESETS_ARRAY: TPreset[] = [
  DEFAULT_PRESET,
  ROCK_PRESET,
  TECHNO_PRESET,
  CLUB_PRESET,
  FULL_BASS_PRESET,
  FULL_BASS_TREBLE_PRESET,
];

export enum ChangeAllBandsEvent {
  min = "min",
  max = "max",
  reset = "reset",
}

export enum ChangeAllBandsFromEvent {
  min = 0,
  max = 100,
  reset = 50,
}

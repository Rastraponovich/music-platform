import {
    Band,
    TMediaStatus,
    TVISUALIZERS,
    TWinampState,
    TWinampWindow,
    UseDraggblePosition,
} from "./types"

export const VISUALIZERS: TVISUALIZERS = {
    OSCILLOSCOPE: "OSCILLOSCOPE",
    BAR: "BAR",
    NONE: "NONE",
    MILKDROP: "MILKDROP",
}

export const VISUALIZER_ORDER = [VISUALIZERS.BAR, VISUALIZERS.OSCILLOSCOPE, VISUALIZERS.NONE]
export const BANDS: Band[] = [60, 170, 310, 600, 1000, 3000, 6000, 12000, 14000, 16000]

export const MEDIA_STATUS: Record<TMediaStatus, TMediaStatus> = {
    PAUSED: "PAUSED",
    PLAYING: "PLAYING",
    STOPPED: "STOPPED",
}

export const WINAMP_STATE: Record<TWinampState, TWinampState> = {
    CREATED: "CREATED",
    INIT: "INIT",
    TRACKLOADED: "TRACKLOADED",
    DESTROYED: "DESTROYED",
    CLOSED: "CLOSED",
    OPENED: "OPENED",
}

export const WINAMP_WINDOW_STATE: Record<TWinampWindow, TWinampWindow> = {
    EQUALIZER: "EQUALIZER",
    NONE: "NONE",
    PLAYER: "PLAYER",
    PLAYLIST: "PLAYLIST",
}
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
}

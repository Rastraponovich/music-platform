import { Nullable } from "@/types"
import { MouseEvent } from "react"
import { Playlist } from "../playlist/types"

export enum EPLAYER_STATE {
    STOPED = "STOPED",
    PLAYED = "PLAYED",
    PAUSED = "PAUSED",
    DESTROYED = "DESTROYED",
}

export enum TIME_MODE {
    ELAPSED = "ELAPSED",
    REMAINING = "REMAINING",
}

export type Song = {
    id?: number
    name: string
    artist: string
    isActive: boolean
    path: string
    cover: string
    likes: number
    comments: any[]
    userId?: number
    user?: any
    metaData: {
        format: {
            tagTypes?: string[]
            trackInfo?: any[]
            lossless?: boolean
            container?: string
            codec?: string
            tool?: string
            sampleRate: number
            numberOfChannels: number
            numberOfSamples?: number
            bitrate: number
            codecProfile?: string
            duration: number
        }
        native: { [key: string]: { id: string; value: string }[] }
        quality: {
            warnings: {
                message: string
            }[]
        }
        common: {
            track: { no: Nullable<number>; of: Nullable<number> }
            disk: { no: Nullable<number>; of: Nullable<number> }
            movementIndex?: any
            encodersettings?: string
        }
    }
    playerPlayListId?: string | null
    playlists?: Playlist[]
    createdAt: Date | string
    updatedAt: Date | string
    deletedAt: Date | string | null
}

export enum EAudioStates {
    HAVE_NOTHING = "HAVE_NOTHING",
    HAVE_METADATA = "HAVE_METADATA",
    HAVE_CURRENT_DATA = "HAVE_CURRENT_DATA",
    HAVE_FUTURE_DATA = "HAVE_FUTURE_DATA",
    HAVE_ENOUGH_DATA = "HAVE_ENOUGH_DATA",
}

export type TAudioStates = Record<string, EAudioStates>

export const AUDIO_STATES: TAudioStates = {
    "0": EAudioStates.HAVE_NOTHING,
    "1": EAudioStates.HAVE_METADATA,
    "2": EAudioStates.HAVE_CURRENT_DATA,
    "3": EAudioStates.HAVE_FUTURE_DATA,
    "4": EAudioStates.HAVE_ENOUGH_DATA,
}

export type TVISUALIZERS = {
    OSCILLOSCOPE: "OSCILLOSCOPE"
    BAR: "BAR"
    NONE: "NONE"
    MILKDROP: "MILKDROP"
}

export type TVISUALIZER = keyof TVISUALIZERS

export type DummyVizData = {
    0: 11.75
    8: 11.0625
    16: 8.5
    24: 7.3125
    32: 6.75
    40: 6.4375
    48: 6.25
    56: 5.875
    64: 5.625
    72: 5.25
    80: 5.125
    88: 4.875
    96: 4.8125
    104: 4.375
    112: 3.625
    120: 1.5625
}

export type Band = 60 | 170 | 310 | 600 | 1000 | 3000 | 6000 | 12000 | 14000 | 16000

export type TWinampState =
    | "DESTROYED"
    | "CREATED"
    | "INIT"
    | "TRACKLOADED"
    | "CLOSED"
    | "OPENED"
    | "MINIMIZED"

export type TMediaStatus = "PLAYING" | "STOPPED" | "PAUSED"

export type TWinampWindow = "PLAYER" | "EQUALIZER" | "PLAYLIST" | "NONE" | "PRESETS"

export type UseDraggblePosition = {
    clientX: string | number
    clientY: string | number
}
export type UseDraggbleReturnProps = [
    onDragStart: (e: MouseEvent<HTMLElement>) => void,
    onDragging: (e: MouseEvent<HTMLElement>) => void,
    onDragEnd: (e: MouseEvent<HTMLElement>) => void
]

export interface Track extends Song {}

export interface StereoBalanceNodeType extends AudioNode {
    constructor(context: AudioContext): StereoBalanceNodeType
    balance: {
        value: number
    }
}

export type _BANDS = { [key in Band]: BiquadFilterNode }

export type MediaElement = {
    _context: AudioContext
    _staticSource: GainNode
    _balance: StereoBalanceNodeType
    _preamp: GainNode
    _analyser: AnalyserNode
    _gainNode: GainNode
    _audio: HTMLAudioElement
    _source: MediaElementAudioSourceNode
    _bands: _BANDS
}

export type PRESET = {
    name: PRESETS_TYPE
    value: Record<Band, number>
}

export type PRESETS_TYPE =
    | "ROCK"
    | "DEFAULT"
    | "TECHNO"
    | "CLASSIC"
    | "CLUB"
    | "FULL BASS"
    | "FULL BASS AND TREBBLE"

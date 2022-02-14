import { Nullable } from "@/types"
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

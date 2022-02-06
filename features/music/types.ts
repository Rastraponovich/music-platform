import { Playlist } from "../playlist/types"

export type Song = {
    id?: number
    name: string
    artist: string
    isActive: boolean
    path: string
    cover: string
    likes: number
    comments: any[]
    userId: number
    user: any
    metaData: any
    playlists: Playlist[]
    createdAt: Date
    updatedAt: Date
    deletedAt: Date
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

//TODO: fix
import { Playlist } from "@/features/playlist/types"
import { Nullable } from "@/types"

export {}

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

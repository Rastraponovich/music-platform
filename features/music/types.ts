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
    playlists: Playlist[]
    createdAt: Date
    updatedAt: Date
    deletedAt: Date
}

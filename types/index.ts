import { Song } from "@/features/music/types"

export type TResponse<T> = [T[], number]
export type Nullable<T> = T | null

export type Album = {
    id: number
    title: string
    content: string
    playlistId?: number
    tracks?: Song[]
    backgroundImage?: string
}

export type TarifLevel = "start" | "standard" | "super"

export type Tarif = {
    id: number
    name: string
    terms: string
    price: number
    level: TarifLevel
    recomended: boolean
}

import { Playlist } from "./types"

export interface CreatePlayListDto extends Playlist {}
export interface UpdatePlayListDto extends Playlist {
    id: number
}

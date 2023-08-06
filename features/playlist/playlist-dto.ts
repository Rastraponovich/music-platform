import { Playlist } from "./types";

/**
 * @deprecated
 */

export interface CreatePlayListDto extends Playlist {}
export interface UpdatePlayListDto extends Playlist {
  id: number;
}

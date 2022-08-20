import { playlist } from "@/features/media/winamp"
import { Song } from "@/src/entity/songs/lib"
import { createEvent } from "effector"
import { sample } from "effector"

export const addToPlaylistButtonClicked = createEvent<Song>()

sample({
    clock: addToPlaylistButtonClicked,
    target: playlist.addTrackToPlaylist,
})

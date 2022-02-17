import { Nullable } from "@/types"
import { createEvent, createStore, guard, sample } from "effector"
import { Track } from "./types"

const addTrackToPlaylist = createEvent<Track>()
const $playlist = createStore<Track[]>([]).on(addTrackToPlaylist, (store, track) => [
    ...store,
    track,
])

const $playlistLength = $playlist.map((state) => state.length)

const removeTrackFromPlaylist = createEvent<number>()

sample({
    clock: removeTrackFromPlaylist,
    source: $playlist,
    filter: (_, id) => id !== null,
    fn: (playlist, id) => playlist.filter((_, index) => index !== id),
    target: $playlist,
})

const selectTrackInPlaylist = createEvent<number>()
const $selectedTrackInPlaylist = createStore<Nullable<number>>(null)
    .on(selectTrackInPlaylist, (_, id) => id)
    .reset(removeTrackFromPlaylist)

const doubleClickInPlaylist = createEvent<number>()

//future realization
const savePlaylist = createEvent()
const loadPlaylist = createEvent()
const moveTrackInPlaylist = createEvent()

export {}

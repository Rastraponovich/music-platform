import { createEvent, createStore, sample } from "effector"
import { ChangeEvent } from "react"
import { MusicAPI } from "./music-api"
import { Song } from "./types"

import { debounce } from "patronum"

const getSongs = createEvent()

const searchTrack = createEvent<string>()

const searchTrackNameFiled = createStore<string>("").on(searchTrack, (_, trackName) => trackName)

const debouncedSearch = debounce({
    source: searchTrackNameFiled,
    timeout: 500,
    target: MusicAPI.searchTrackFx,
})

sample({
    clock: getSongs,
    target: MusicAPI.getAllSongsFx,
})

const $songs = createStore<Song[]>([])
    .on(MusicAPI.getAllSongsFx.doneData, (_, res) => res.data[0])
    .on(MusicAPI.searchTrackFx.doneData, (_, res) => res.data[0])
const $countSongs = createStore<number>(0).on(
    MusicAPI.getAllSongsFx.doneData,
    (_, res) => res.data[1]
)

const $currentSong = createStore<Song>({ userId: 5 } as Song)
    .on(MusicAPI.saveSongFx.doneData, (_, res) => res.data)
    .reset(getSongs)

const changeSong = createEvent<ChangeEvent<HTMLInputElement>>()

sample({
    clock: changeSong,
    source: $currentSong,
    fn: (song, event) => ({ ...song, [event.target.name]: event.target.value }),
    target: $currentSong,
})

const uploadFile = createEvent<ChangeEvent<HTMLInputElement>>()

const $files = createStore<{ music: File; image: File }>({
    music: {} as File,
    image: {} as File,
})

sample({
    clock: uploadFile,
    source: $files,
    fn: (files, event) => ({ ...files, [event.target.name]: event.target.files![0] }),
    target: $files,
})

const submitted = createEvent<ChangeEvent<HTMLFormElement>>()

submitted.watch((e: ChangeEvent<HTMLFormElement>) => e.preventDefault())

sample({
    clock: submitted,
    source: [$currentSong, $files],
    fn: ([song, files], _) => ({ ...song, ...files } as Song & { image: File; music: File }),
    target: MusicAPI.saveSongFx,
})

export {
    getSongs,
    $songs,
    $countSongs,
    $currentSong,
    submitted,
    changeSong,
    uploadFile,
    $files,
    searchTrack,
}

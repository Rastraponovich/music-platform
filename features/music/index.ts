import axios from "axios"
import { attach, createEffect, createEvent, createStore, forward, sample } from "effector"
import { ChangeEvent } from "react"
import { MusicAPI } from "./music-api"
import { Song } from "./types"

const getSongs = createEvent()

sample({
    clock: getSongs,
    target: MusicAPI.getAllSongsFx,
})

const $songs = createStore<Song[]>([]).on(MusicAPI.getAllSongsFx.doneData, (_, res) => res.data[0])
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
    fn: ([song, files], _) => ({ ...song, ...files }),
    target: MusicAPI.saveSongFx,
})

const setProgress = createEvent<number>()
const $pgorgress = createStore<number>(0).on(setProgress, (_, payload) => payload)

const setDuration = createEvent<number>()
const $duration = createStore<number>(0).on(setDuration, (_, payload) => payload)

const setVolume = createEvent<number>()
const $volume = createStore<number>(50).on(setVolume, (_,payload) => payload)

export {
    getSongs,
    $songs,
    $countSongs,
    $currentSong,
    submitted,
    changeSong,
    uploadFile,
    $files,
    $pgorgress,
    setProgress,
    $duration,
    setDuration,
    setVolume,
$volume,
}

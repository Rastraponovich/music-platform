import { createApi, createEffect, createEvent, createStore, guard } from "effector"
import { on } from "events"
import { sample } from "lodash"
import { ChangeEvent } from "react"
import Media from "../media"
import { Song } from "./types"

const selectTrack = createEvent<Song>()

const initTrack = createEvent<number>()

const $trackLoaded = createStore<boolean>(false)
    .on(initTrack, (state, payload) => true)
    .reset(selectTrack)

const $currentTrack = createStore<Song | null>(null).on(selectTrack, (_, payload) => payload)

const $volume = createStore<number>(50)

const { initVolume, changeVolume } = createApi($volume, {
    initVolume: (_, value: number) => value,
    changeVolume: (_, event: ChangeEvent<HTMLInputElement>) => Number(event.target.value),
})

const $pgorgress = createStore<number>(0).reset(selectTrack)

const { initProgress, changeProgress } = createApi($pgorgress, {
    initProgress: (_, value: number) => value,
    changeProgress: (_, event: ChangeEvent<HTMLInputElement>) => Number(event.target.value),
})
const setDuration = createEvent<number>()
const $duration = createStore(0)
    .on(setDuration, (_, duration) => duration)
    .reset(selectTrack)

const progress = {
    $pgorgress,
    changeProgress,
    initProgress,
}
const volume = {
    $volume,
    initVolume,
    changeVolume,
}

const $playing = createStore<boolean>(false).reset(selectTrack)

const { play, pause } = createApi($playing, {
    play: () => true,
    pause: () => false,
})

const player = {
    volume,
    progress,
    $currentTrack,
    selectTrack,
    initTrack,
    $trackLoaded,
    $playing,
    play,
    pause,
    setDuration,
    $duration,
}

// $trackLoaded.watch((args) => console.log(args, "trackLoaded"))

// $playing.watch((args) => console.log(args, "playing"))

const $refAudio = createStore<Media>(new Media())

$refAudio
    .on(initVolume, (ref, value) => {
        ref.setVolume(value)

        console.log(ref._gainNode.gain.value, value)
    })
    .on(changeVolume, (ref, event) => {
        ref.setVolume(Number(event.target.value))

        console.log(ref._gainNode.gain.value, Number(event.target.value))
    })
    .on($currentTrack, (ref, track) => {
        ref.loadFromUrl(`${process.env.NEXT_PUBLIC_BACKEND}/music/${track!.path}`, true)
    })
    .on(play, (ref, _) => {
        ref.play()
    })
    .on(pause, (ref, _) => ref.stop())

$refAudio.watch((args) => console.log(args))

export { player, $refAudio }

import { createApi, createEffect, createEvent, createStore, guard, sample } from "effector"
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

const $timeRemaining = createStore<number>(0)

sample({
    clock: $pgorgress,
    source: $duration,
    fn: (duration, progress) => duration - progress,
    target: $timeRemaining,
})

$timeRemaining.watch(console.log)

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

const media = new Media()

media.timeRemaining()
export { player }

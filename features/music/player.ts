import {
    attach,
    createApi,
    createEffect,
    createEvent,
    createStore,
    forward,
    guard,
    restore,
    sample,
} from "effector"

import { throttle, condition } from "patronum"

import { createGate } from "effector-react"
import { ChangeEvent } from "react"
import { MusicAPI } from "./music-api"
import { AUDIO_STATES, EAudioStates, Song, TAudioStates } from "./types"

const selectTrack = createEvent<Song>()

const initTrack = createEvent<number>()

const $trackState = restore(initTrack, 0)

$trackState.watch(console.log)

const $trackLoaded = createStore<boolean>(false)
    .on(initTrack, (state, payload) => {
        return true
    })
    .reset(selectTrack)

const $currentTrack = createStore<Song | null>(null).on(selectTrack, (_, payload) => {
    return payload
})

const $volume = createStore<number>(50)

const { initVolume, changeVolume } = createApi($volume, {
    initVolume: (_, value: number) => value,
    changeVolume: (_, event: ChangeEvent<HTMLInputElement>) => Number(event.target.value),
})

const onSeeking = createEvent<ChangeEvent<HTMLInputElement>>()

const $allowSeeking = createStore<boolean>(true)

const { onmousedown, onmouseup } = createApi($allowSeeking, {
    onmousedown: () => false,
    onmouseup: () => true,
})

const $seekingProgress = createStore<number>(0).on(onSeeking, (_, event) =>
    Number(event.target.value)
)
const $progress = createStore<number>(0)
    .reset(selectTrack)
    .on(onSeeking, (_, event) => Number(event.target.value))

const { setProgress, changeProgress } = createApi($progress, {
    setProgress: (_, value: number) => value,
    changeProgress: (_, event: ChangeEvent<HTMLInputElement>) => Number(event.target.value),
})

const initProgress = createEvent<number>()
condition({
    source: initProgress,
    if: $allowSeeking,
    then: setProgress,
})

const setDuration = createEvent<number>()
const $duration = createStore(0)
    .on(setDuration, (_, duration) => duration)
    .reset(selectTrack)

const $playing = createStore<boolean>(false).reset(selectTrack)

const $timeRemaining = createStore<number>(0)

const onSetLoopEnabled = createEvent()
const $loop = createStore<boolean>(false).on(onSetLoopEnabled, (state, _) => !state)

sample({
    clock: $progress,
    source: $duration,
    fn: (duration, progress) => duration - progress,
    target: $timeRemaining,
})

const { onPlay, onPause } = createApi($playing, {
    onPlay: () => true,
    onPause: () => false,
})

const onSetPlayListEnabled = createEvent()
const onSetPlayListDisabled = createEvent()

const $playListEnabled = createStore<boolean>(false)
    .on(onSetPlayListEnabled, () => true)
    .on(onSetPlayListDisabled, () => false)

const $playList = createStore<Song[]>([])

const { onAddToPlayList, onRemoveFromPlayList } = createApi($playList, {
    onAddToPlayList: (state, track: Song) => {
        const disAllowAdd = state.some((item) => item.id === track.id)

        if (disAllowAdd) return
        return [...state, track]
    },
    onRemoveFromPlayList: (state, track: Song) => {
        return state.filter((item) => item.id !== track.id)
    },
})

$playList.watch((state) => state.length === 0 && onSetPlayListDisabled())
$playList.watch((state) => state.length !== 0 && onSetPlayListEnabled())

const getMetaData = createEvent<string>()

const playList = {
    $playListEnabled,
    $playList,
    onAddToPlayList,
    onRemoveFromPlayList,
}

const progress = {
    $progress,
    changeProgress,
    initProgress,
    $seekingProgress,
    $timeRemaining,
    $allowSeeking,
    onmousedown,
    onmouseup,
}
const volume = {
    $volume,
    initVolume,
    changeVolume,
}

const player = {
    volume,
    progress,
    $currentTrack,
    selectTrack,
    initTrack,
    $trackLoaded,
    $playing,
    onPlay,
    onPause,
    setDuration,
    $duration,
    onSeeking,
    $loop,
    onSetLoopEnabled,
    onSetPlayListEnabled,
    playList,

    $trackState,
}

export const PlayerGate = createGate<any>()

export const PlayListGate = createGate<any>()

PlayListGate.open.watch((args) => console.log(args))

const createTrackFactory = (track: Song) => {
    const $track = createStore<Song>(track)

    const getMetadata = createEvent<string>()

    const getMetaDataFx = attach({
        effect: MusicAPI.getMetadataFx,
        mapParams: (src) => src,
    })

    sample({
        clock: $track,
        fn: (track) => track.path,
        target: getMetaDataFx,
    })

    const $metaData = createStore<any>(null)
        .on(getMetaDataFx.doneData, (_, res) => res.data)
        .reset(getMetaData)

    return { getMetadata, $metaData, $track }
}

export { player, createTrackFactory }

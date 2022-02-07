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
    scopeBind,
} from "effector"

import { throttle, condition } from "patronum"

import { createGate } from "effector-react"
import { ChangeEvent } from "react"
import { MusicAPI } from "./music-api"
import { AUDIO_STATES, EAudioStates, Song, TAudioStates } from "./types"
import { getClientScope } from "@/hooks/useScope"
import { Nullable } from "@/types"

export const initPlayer = createEvent()
export const destroyPlayer = createEvent()

const $audio = createStore<Nullable<HTMLAudioElement>>(null)

const selectTrack = createEvent<Song>()

const initTrack = createEvent<number>()

const $trackState = restore(initTrack, 0)

$trackState.watch(console.log)

const $trackLoaded = createStore<boolean>(false)
    .on(initTrack, () => true)
    .reset(selectTrack)

const $currentTrack = createStore<Nullable<Song>>(null).on(selectTrack, (_, payload) => {
    return payload
})

const $volume = createStore<number>(50)

const { setVolume, changeVolume } = createApi($volume, {
    setVolume: (_, value: number) => value,
    changeVolume: (_, event: ChangeEvent<HTMLInputElement>) => Number(event.target.value),
})

const onVolumeChangeFx = createEffect<number, void>((value) => {
    const callSetVolume = scopeBind(setVolume, {
        scope: getClientScope()!,
    })
    callSetVolume(value)
})

const onVolumeChange = createEvent<number>()

guard({ clock: onVolumeChange, filter: $trackLoaded, target: onVolumeChangeFx })

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

const onTimeUpdateFx = createEffect<number, void>((value) => {
    const callSetCurrentTime = scopeBind(setProgress, {
        scope: getClientScope()!,
    })
    callSetCurrentTime(value)
})

const onTimeUpdate = createEvent<number>()

guard({ clock: onTimeUpdate, filter: $allowSeeking, target: onTimeUpdateFx })

const setDuration = createEvent<number>()
const $duration = createStore(0)
    .on(setDuration, (_, duration) => duration)
    .reset(selectTrack)

const $playing = createStore<boolean>(false).reset(selectTrack)

const { onPlay, onPause, setIsPlaying } = createApi($playing, {
    onPlay: () => true,
    onPause: () => false,
    setIsPlaying: (_, payload: boolean) => payload,
})

const $timeRemaining = createStore<number>(0)

sample({
    clock: $progress,
    source: $duration,
    fn: (duration, progress) => duration - progress,
    target: $timeRemaining,
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

const onSetCompact = createEvent()
const $compact = createStore<boolean>(false).on(onSetCompact, (state, _) => !state)

const onSetLoopEnabled = createEvent()
const $loop = createStore<boolean>(false).on(onSetLoopEnabled, (state, _) => !state)

const playList = {
    $playListEnabled,
    $playList,
    onAddToPlayList,
    onRemoveFromPlayList,
}

const progress = {
    $progress,
    changeProgress,
    onTimeUpdate,
    $seekingProgress,
    $timeRemaining,
    $allowSeeking,
    onmousedown,
    onmouseup,
}
const volume = {
    $volume,
    onVolumeChange,
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
    onSetCompact,
    $compact,
    $trackState,
}

export const PlayListGate = createGate<any>()

PlayListGate.open.watch((args) => console.log(args))
//------------------------------------------------------//

const createPlayerFx = createEffect<boolean, HTMLAudioElement>((loop) => {
    const audio = new Audio()
    audio.autoplay = false
    audio.controls = false
    audio.loop = loop

    // abort Событие вызывается , когда ресурс не был полностью загружен, но не в результате ошибки.
    audio.addEventListener("abort", onAbort)
    // canplay Событие вызывается , когда агент пользователя может играть средства массовой информации, но, по оценкам, что не достаточно данных были загружены, чтобы играть средства массовой информации до его конца без остановки для дальнейшей буферизации контента.
    audio.addEventListener("canplay", onCanPlay)
    // canplaythrough Событие вызывается , когда агент пользователя может играть средства массовой информации, и оценки , которые были загружены достаточно данных для воспроизведения медиа до его конца без остановки для дальнейшей буферизации контента.
    audio.addEventListener("canplaythrough", onCanPlayThrough)
    // durationchange Событие вызывается , когда duration атрибут был обновлен.
    audio.addEventListener("durationchange", onDurationChange)
    // emptied Событие вызывается , когда среда становится пустой; например, это событие отправляется, если носитель уже был загружен (или частично загружен) и load()вызывается метод для его перезагрузки.
    audio.addEventListener("emptied", onEmptied)
    // ended Событие вызывается , когда воспроизведение или потоковое остановилось , потому что достигнут конец массовой информации или потому , что нет дополнительных данных не имеется.
    audio.addEventListener("ended", onEnded)
    // error Событие вызывается , когда ресурс не может быть загружен из - за ошибки (например, проблемы подключения к сети).
    audio.addEventListener("error", onError)
    // loadeddata Событие вызывается , когда кадр в текущей позиции воспроизведения средств массовой информации по окончанию загрузки; часто первый кадр.
    audio.addEventListener("loadeddata", onLoadedData)
    // loadedmetadata Событие вызывается , когда метаданные были загружены.
    audio.addEventListener("loadedmetadata", onLoadedMetadata)
    // loadstart Событие вызывается , когда браузер начал загружать ресурс.
    audio.addEventListener("loadstart", onLoadStart)
    // pause Событие отправляется , когда запрос приостановить деятельность осуществляется и деятельность вошла в приостановленное состояние, чаще всего после того, как в средствах массовой информации было приостановлено через вызов элемента pause()метода.
    audio.addEventListener("pause", onPause1)
    // play Событие вызывается , когда pausedсвойство изменяется от trueдо false, в результате playметода, или autoplayатрибута.
    audio.addEventListener("play", onPlay1)
    // playing Событие вызывается после того, как воспроизведение первым начало, и всякий раз , когда он будет перезапущен. Например, он срабатывает, когда воспроизведение возобновляется после паузы или задержки из-за отсутствия данных.
    audio.addEventListener("playing", onPlaying)
    // progress Событие вызывается периодически как браузер загружает ресурс.
    audio.addEventListener("progress", onProgress)
    // ratechange Событие вызывается , когда скорость воспроизведения изменилась.
    audio.addEventListener("ratechange", onRateChange)
    // seeked Событие вызывается , когда операция поиска завершена, текущая позиция воспроизведения изменилась, и булево seekingатрибут изменено false.
    audio.addEventListener("seeked", onSeeked)
    // seeking Событие вызывается , когда начинаются искать операции, то есть булева seekingатрибут изменен trueи СМИ ищут новую позицию.
    audio.addEventListener("seeking", onSeeking1)
    // stalled Событие вызывается , когда агент пользователя пытается получать мультимедийные данные, но данные неожиданно не последовало.
    audio.addEventListener("stalled", onStalled)
    // suspend Событие вызывается при загрузке мультимедийных данных было приостановлено.
    audio.addEventListener("suspend", onSuspend)
    // timeupdate Событие вызывается , когда время , указанное в currentTimeатрибуте было обновлено.
    audio.addEventListener("timeupdate", onTimeUpdate1)
    // volumechange Событие вызывается , когда объем изменился.
    audio.addEventListener("volumechange", onVolumeChange1)
    // waiting Событие вызывается , когда воспроизведение остановлено из - за временного отсутствия данных.
    audio.addEventListener("waiting", onWaiting)
    audio.src = `http://localhost:4000/music/7f2ddd70-73a5-45a2-83af-1cd3d93c9bf4.mp3`

    return audio
})

sample({
    clock: initPlayer,
    source: $loop,
    fn: (loop, _) => loop,
    target: createPlayerFx,
})

$audio.on(createPlayerFx.doneData, (_, audio) => {
    console.log(audio)

    return audio
})

guard({
    clock: onPlay,
    source: $audio,
    filter: (audio): audio is HTMLAudioElement => audio instanceof HTMLAudioElement,
    target: createEffect<HTMLAudioElement, void>((audio) => audio.play()),
})

guard({
    clock: onPause,
    source: $audio,
    filter: (audio): audio is HTMLAudioElement => audio instanceof HTMLAudioElement,
    target: createEffect<HTMLAudioElement, void>((audio) => audio.pause()),
})

const onAbort = (event: Event) => {
    // console.log("abort", { el: event.currentTarget });
}

const onCanPlay = (event: Event) => {
    // console.log("canplay");
    // const audioElement = event.currentTarget as HTMLAudioElement;
    // audioElement.play();
}

const onCanPlayThrough = (event: Event) => {
    // console.log("canplaythrough");
    // const audioElement = event.currentTarget as HTMLAudioElement;
    // audioElement.play();
}

const onDurationChange = (event: Event) => {
    const audioElement = event.currentTarget as HTMLAudioElement

    const callSetDuration = scopeBind(setDuration, { scope: getClientScope()! })
    callSetDuration(audioElement.duration)
}

const onEmptied = (event: Event) => {
    // console.log("emptied", { el: event.currentTarget });
}

const onEnded = (event: Event) => {
    // console.log("ended", { el: event.currentTarget });
}

const onError = (event: Event) => {
    // console.log("error", { el: event.currentTarget });
}

const onLoadedData = (event: Event) => {
    // console.log("loadeddata", { el: event.currentTarget });
}

const onLoadedMetadata = (event: Event) => {
    console.log(event)

    // console.log("loadedmetadata", { el: event.currentTarget });
}

const onLoadStart = (event: Event) => {
    // console.log("loadstart", { el: event.currentTarget });
}
const onPause1 = (_event: Event) => {
    console.log("pause")
    // const callSetPause = scopeBind(setPause, { scope: getClientScope()! });
    // callSetPause();
}

const onPlay1 = (_event: Event) => {
    console.log("play")
    // const callSetPlaying = scopeBind(setPlaying, { scope: getClientScope()! });
    // callSetPlaying();
}

const onPlaying = (event: Event) => {
    const audio = event.currentTarget as HTMLAudioElement
    const callSetIsPlaying = scopeBind(setIsPlaying, {
        scope: getClientScope()!,
    })
    callSetIsPlaying(!audio.paused)
}

const onProgress = (event: Event) => {
    // console.log("progress", { el: event.currentTarget });
}

const onRateChange = (event: Event) => {
    // console.log("ratechange", { el: event.currentTarget });
}

const onSeeked = (event: Event) => {
    // console.log("seeked", { el: event.currentTarget });
}

const onSeeking1 = (event: Event) => {
    // console.log("seeking", { el: event.currentTarget });
}

const onStalled = (event: Event) => {
    // console.log("stalled", { el: event.currentTarget });
}

const onSuspend = (event: Event) => {
    // console.log("suspend", { el: event.currentTarget });
}

const onTimeUpdate1 = (event: Event) => {
    console.log(event)

    const audio = event.currentTarget as HTMLAudioElement
    const callSetCurrentTime = scopeBind(onTimeUpdate, {
        scope: getClientScope()!,
    })
    callSetCurrentTime(audio.currentTime)
}

const onVolumeChange1 = (event: Event) => {
    // console.log("volumechange", { el: event.currentTarget });
}

const onWaiting = (event: Event) => {
    // console.log("waiting", { el: event.currentTarget });
}

guard({
    source: sample({ clock: $audio, source: $currentTrack, fn: (audio, track) => [audio, track] }),
    filter: (sourceTuple): sourceTuple is [HTMLAudioElement, Song] =>
        sourceTuple[0] instanceof HTMLAudioElement && sourceTuple[1] !== null,
    target: createEffect<[HTMLAudioElement, Song], void>(([audio, track]) => {
        console.log(audio, track)

        audio.src = `${process.env.NEXT_PUBLIC_BACKEND}/music/${track!.path}`

        audio.load()
        audio.play()
    }),
})

export { player }

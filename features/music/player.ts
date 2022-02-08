import {
    createApi,
    createEffect,
    createEvent,
    createStore,
    guard,
    sample,
    scopeBind,
} from "effector"

import { throttle, condition } from "patronum"

import { v4 as uuid } from "uuid"

import { createGate } from "effector-react"
import { ChangeEvent, MouseEvent } from "react"
import { Song } from "./types"
import { getClientScope } from "@/hooks/useScope"
import { Nullable } from "@/types"

export const initPlayer = createEvent()
export const destroyPlayer = createEvent()

const $audio = createStore<Nullable<HTMLAudioElement>>(null)

const selectTrack = createEvent<Song>()

const $trackState = createStore<number>(0)

const $currentTrack = createStore<Nullable<Song>>(null).on(selectTrack, (_, payload) => {
    return { ...payload, playerPlayListId: uuid() }
})
const setVolume = createEvent<number>()
const changeVolume = createEvent<ChangeEvent<HTMLInputElement>>()
const $volume = createStore<number>(50).on(setVolume, (_, volume) => volume)

const onmousedown = createEvent<MouseEvent<HTMLInputElement>>()
const onmouseup = createEvent<MouseEvent<HTMLInputElement>>()
const $allowSeeking = createStore<boolean>(true)
    .on(onmousedown, () => false)
    .on(onmouseup, () => true)

//progress
const $currentTime = createStore<number>(0).reset($currentTrack)

const $seekingProgress = createStore<number>(0)

const setCurrentTime = createEvent<number>()
const changeCurrentTime = createEvent<number>()

const seekingCurrentTime = createEvent<ChangeEvent<HTMLInputElement>>()

$seekingProgress.on(seekingCurrentTime, (_, event) => Number(event.target.value))

sample({
    clock: onmouseup,
    source: $seekingProgress,
    target: changeCurrentTime,
})

$currentTime.reset(selectTrack).on($seekingProgress, (_, seekedTime) => seekedTime)

guard({
    source: setCurrentTime,
    filter: $allowSeeking,
    target: $currentTime,
})

const setDuration = createEvent<number>()
const $duration = createStore(0)
    .on(setDuration, (_, duration) => duration)
    .reset(selectTrack)

const $playing = createStore<boolean>(false).reset(selectTrack)

const { onPlayClicked, onPauseClicked, setIsPlaying, setPause, setPlaying } = createApi($playing, {
    onPlayClicked: () => true,
    onPauseClicked: () => false,
    setPause: () => false,
    setPlaying: () => true,
    setIsPlaying: (_, payload: boolean) => payload,
})

const $timeRemaining = createStore<number>(0)

sample({
    clock: $currentTime,
    source: $duration,
    fn: (duration, progress) => duration - progress,
    target: $timeRemaining,
})

const setShowVisiblePlaylist = createEvent()
const $visiblePlaylist = createStore<boolean>(false).on(
    setShowVisiblePlaylist,
    (visible, _) => !visible
)

const $playList = createStore<Song[]>([])

const $playListLength = createStore<number>(0).on($playList, (_, playlist) => playlist.length)

const selectTrackInPlayList = createEvent<number>()
const $currentPlayedTrackIndexPlaylist = createStore<Nullable<number>>(null)
    .on(selectTrack, () => 0)
    .on(selectTrackInPlayList, (_, newIndex) => newIndex)

//когда трек закончится вызываем проверку на переключение на следующий трек
const checkNextTrack = createEvent()

//если плейлист не пуст то передаем его длину
const allowSelectNextTrack = guard({
    clock: checkNextTrack,
    source: $playListLength,
    filter: (playlistLength, _) => (playlistLength === 0 ? false : true),
})

//если плейлист не пуст то берем индекс текущего трека, проверяем если не последний то передаем следущий индекс иначе возвращаем 0
const selectNextTrack = sample({
    clock: allowSelectNextTrack,
    source: $currentPlayedTrackIndexPlaylist,

    fn: (currentIndex, playListLength) => {
        const lastTrack = currentIndex === playListLength - 1

        if (lastTrack) return 0
        return currentIndex! + 1
    },
})

// меняем индекс
sample({
    clock: selectNextTrack,
    fn: (newIndex) => newIndex,
    target: $currentPlayedTrackIndexPlaylist,
})
// выбераем новый трек по пришедшему индексу

sample({
    clock: $currentPlayedTrackIndexPlaylist,
    source: $playList,
    fn: (playlist, newIndex) => playlist[newIndex!],
    target: $currentTrack,
})

//добавляем трек в плейлист если его выбрали с панели
sample({
    clock: selectTrack,
    source: $currentTrack,
    fn: (track, _) => [track!],
    target: $playList,
})

const $playlistTracksLength = createStore<any>(0).on($playList, (_, tracks) => {
    let initialValue = 0
    const sum = tracks.reduce(
        (accumulator, currentValue) => accumulator + currentValue.metaData.format.duration,
        initialValue
    )
    // sum == 6
    return sum
})

const { onAddToPlayList, onRemoveFromPlayList } = createApi($playList, {
    onAddToPlayList: (state, track: Song) => {
        return [...state, { ...track, playerPlayListId: uuid() }]
    },
    onRemoveFromPlayList: (state, track: Song) => {
        return state.filter((item) => item.id !== track.id)
    },
})

const onSetCompact = createEvent()
const $compact = createStore<boolean>(false).on(onSetCompact, (state, _) => !state)

const onSetLoopEnabled = createEvent()
const $loop = createStore<boolean>(false).on(onSetLoopEnabled, (state, _) => !state)

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
    audio.addEventListener("pause", onPause)
    // play Событие вызывается , когда pausedсвойство изменяется от trueдо false, в результате playметода, или autoplayатрибута.
    audio.addEventListener("play", onPlay)
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
    audio.addEventListener("timeupdate", onTimeUpdate)
    // volumechange Событие вызывается , когда объем изменился.
    audio.addEventListener("volumechange", onVolumeChange)
    // waiting Событие вызывается , когда воспроизведение остановлено из - за временного отсутствия данных.
    audio.addEventListener("waiting", onWaiting)

    return audio
})

sample({
    clock: initPlayer,
    source: $loop,
    fn: (loop, _) => loop,
    target: createPlayerFx,
})

$audio.on(createPlayerFx.doneData, (_, audio) => audio)

guard({
    source: sample({ clock: $currentTrack, source: $audio, fn: (audio, track) => [audio, track] }),
    filter: (sourceTuple): sourceTuple is [HTMLAudioElement, Song] =>
        sourceTuple[0] instanceof HTMLAudioElement && sourceTuple[1] !== null,
    target: createEffect<[HTMLAudioElement, Song], void>(([audio, track]) => {
        audio.src = `${process.env.NEXT_PUBLIC_BACKEND}/music/${track!.path}`
        audio.load()
        audio.play()
    }),
})

guard({
    clock: onPlayClicked,
    source: $audio,
    filter: (audio): audio is HTMLAudioElement => audio instanceof HTMLAudioElement,
    target: createEffect<HTMLAudioElement, void>((audio) => audio.play()),
})

guard({
    clock: onPauseClicked,
    source: $audio,
    filter: (audio): audio is HTMLAudioElement => audio instanceof HTMLAudioElement,
    target: createEffect<HTMLAudioElement, void>((audio) => audio.pause()),
})

guard({
    clock: $loop,
    source: [$audio, $loop],
    filter: (params): params is [HTMLAudioElement, boolean] =>
        params[0] instanceof HTMLAudioElement,
    target: createEffect<[HTMLAudioElement, boolean], void>(([audio, loop]) => {
        audio.loop = loop
    }),
})
//Изменение громкости из UI
guard({
    source: sample({ clock: changeVolume, source: $audio, fn: (audio, event) => [audio, event] }),
    filter: (sourceTuple): sourceTuple is [HTMLAudioElement, ChangeEvent<HTMLInputElement>] =>
        sourceTuple[0] instanceof HTMLAudioElement,
    target: createEffect<[HTMLAudioElement, ChangeEvent<HTMLInputElement>], void>(
        ([audio, event]) => {
            audio.volume = Number(event.target.value) / 100
        }
    ),
})
//Изменение положения в треке из UI

guard({
    source: sample({
        clock: changeCurrentTime,
        source: [$audio, $allowSeeking],
        fn: ([audio, allowSeeking], event) => [audio, event, allowSeeking],
    }),
    filter: (sourceTuple): sourceTuple is [HTMLAudioElement, number, boolean] =>
        sourceTuple[0] instanceof HTMLAudioElement && sourceTuple[2] === true,
    target: createEffect<[HTMLAudioElement, number, boolean], void>(
        ([audio, newcurrentTime, allowSeeking]) => {
            if (allowSeeking) {
                console.log(allowSeeking)

                audio.currentTime = newcurrentTime
            }
        }
    ),
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

// sample({
//     clock: checkNextTrack,
//     source: [$playList, $currentTrack],

//     fn: ([sourcePlaylist, currentTrack], _) => {
//         const currentPlayingTrackIndex = sourcePlaylist.findIndex(
//             (playListTrack) => playListTrack.playerPlayListId === currentTrack?.playerPlayListId
//         )

//         if (currentPlayingTrackIndex >= 0) {
//             const isLastTrack = sourcePlaylist.length - 1 === currentPlayingTrackIndex
//             if (isLastTrack) return sourcePlaylist[0]
//             return sourcePlaylist[currentPlayingTrackIndex + 1]
//         }

//         return currentTrack
//     },

//     target: $currentTrack,
// })

const onEnded = (event: Event) => {
    const callCheckNextTrack = scopeBind(checkNextTrack, { scope: getClientScope()! })

    callCheckNextTrack()
    console.log("ended", { el: event })
}

const onError = (event: Event) => {
    // console.log("error", { el: event.currentTarget });
}

const onLoadedData = (event: Event) => {
    // console.log("loadeddata", { el: event.currentTarget });
}

const onLoadedMetadata = (event: Event) => {
    // console.log("loadedmetadata", { el: event.currentTarget });
}

const onLoadStart = (event: Event) => {
    // console.log("loadstart", { el: event.currentTarget });
}
const onPause = (_event: Event) => {
    console.log("pause")
    const callSetPause = scopeBind(setPause, { scope: getClientScope()! })
    callSetPause()
}

const onPlay = (_event: Event) => {
    console.log("play")
    const callSetPlaying = scopeBind(setPlaying, { scope: getClientScope()! })
    callSetPlaying()
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

const onTimeUpdate = (event: Event) => {
    const audio = event.currentTarget as HTMLAudioElement

    const callSetCurrentTime = scopeBind(setCurrentTime, {
        scope: getClientScope()!,
    })

    callSetCurrentTime(audio.currentTime)
}

const onVolumeChange = (event: Event) => {
    const audioElement = event.currentTarget as HTMLAudioElement
    const callSetVolume = scopeBind(setVolume, { scope: getClientScope()! })
    callSetVolume(audioElement.volume * 100)
}

const onWaiting = (event: Event) => {
    // console.log("waiting", { el: event.currentTarget });
}

guard({
    clock: destroyPlayer,
    source: $audio,
    filter: (audio): audio is HTMLAudioElement => audio instanceof HTMLAudioElement,
    target: createEffect<HTMLAudioElement, void>((audio) => {
        audio.removeEventListener("abort", onAbort)
        audio.removeEventListener("canplay", onCanPlay)
        audio.removeEventListener("canplaythrough", onCanPlayThrough)
        audio.removeEventListener("durationchange", onDurationChange)
        audio.removeEventListener("emptied", onEmptied)
        audio.removeEventListener("ended", onEnded)
        audio.removeEventListener("error", onError)
        audio.removeEventListener("loadeddata", onLoadedData)
        audio.removeEventListener("loadedmetadata", onLoadedMetadata)
        audio.removeEventListener("loadstart", onLoadStart)
        audio.removeEventListener("pause", onPause)
        audio.removeEventListener("play", onPlay)
        audio.removeEventListener("playing", onPlaying)
        audio.removeEventListener("progress", onProgress)
        audio.removeEventListener("ratechange", onRateChange)
        audio.removeEventListener("seeked", onSeeked)
        audio.removeEventListener("seeking", onSeeking1)
        audio.removeEventListener("stalled", onStalled)
        audio.removeEventListener("suspend", onSuspend)
        audio.removeEventListener("timeupdate", onTimeUpdate)
        audio.removeEventListener("volumechange", onVolumeChange)
        audio.removeEventListener("waiting", onWaiting)
    }),
})

const playList = {
    $playList,
    onAddToPlayList,
    onRemoveFromPlayList,
    $currentPlayedTrackIndexPlaylist,
    selectTrackInPlayList,
    $visiblePlaylist,
    setShowVisiblePlaylist,
    $playlistTracksLength,
}

const progress = {
    $currentTime,
    seekingCurrentTime,
    $seekingProgress,
    $timeRemaining,
    $allowSeeking,
    onmousedown,
    onmouseup,
}
const volume = {
    $volume,
    changeVolume,
}

const controls = {
    onPauseClicked,
    onPlayClicked,
}

const player = {
    controls,
    volume,
    progress,
    $currentTrack,
    selectTrack,
    $playing,
    setDuration,
    $duration,
    $loop,
    onSetLoopEnabled,
    playList,
    onSetCompact,
    $compact,
    $trackState,
}

export { player }

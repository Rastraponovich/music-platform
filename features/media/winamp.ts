import { getClientScope, useScope } from "@/hooks/useScope"
import { Nullable } from "@/types"
import { baseSkinColors } from "@/types/ui.types"
import { sample, createEffect, createEvent, createStore, guard, scopeBind, Effect } from "effector"
import { delay } from "patronum"
import { ChangeEvent, MouseEvent } from "react"
import { BANDS } from "../music/constants"
import { $frequency, toggleEnabledEQ } from "../music/eq"
import { Band, Song, TIME_MODE } from "../music/types"
import StereoBalanceNode from "./StereoBalanceNode"
import { TimeMode } from "./types"

interface StereoBalanceNodeType extends AudioNode {
    constructor(context: AudioContext): StereoBalanceNodeType
    balance: {
        value: number
    }
}

type MediaStatus = "PLAYING" | "STOPPED" | "PAUSED"
type LoadStyle = "BUFFER" | "PLAY" | "NONE"
type MediaTagRequestStatus = "INITIALIZED" | "FAILED" | "COMPLETE" | "NOT_REQUESTED"

type _BANDS = { [key in Band]: BiquadFilterNode }

type MediaElement = {
    _context: AudioContext
    _staticSource: GainNode
    _balance: StereoBalanceNodeType
    _preamp: GainNode
    _analyser: AnalyserNode
    _gainNode: GainNode
    _audio: HTMLAudioElement
    _source: MediaElementAudioSourceNode
    _bands: _BANDS
}

declare global {
    interface Window {
        webkitAudioContext: {
            new (contextOptions?: AudioContextOptions | undefined): AudioContext
            prototype: AudioContext
        }
    }
}
const Emitter = {
    onAbort: (e: Event) => {},
    onCanPlay: (e: Event) => {},
    onCanPlayThrough: (e: Event) => {},
    onDurationChange: (event: Event) => {
        const audioElement = event.currentTarget as HTMLAudioElement
        const callSetDuration = scopeBind(setDuration, { scope: getClientScope()! })
        callSetDuration(audioElement.duration)
    },
    onEmptied: (e: Event) => {},
    onEnded: (e: Event) => {
        const callCheckNextTrack = scopeBind(checkNextTrack, { scope: getClientScope()! })
        callCheckNextTrack()
    },
    onError: (e: Event) => {},
    onLoadedData: (e: Event) => {},
    onLoadedMetadata: (e: Event) => {},
    onLoadStart: (event: Event) => {
        console.log(event, "onLoadStart")
    },
    onPause: (event: Event) => {
        console.log(event, "onPause")
        const callSetIsPlaying = scopeBind(setMediaStatus, {
            scope: getClientScope()!,
        })
        callSetIsPlaying("PAUSED")
    },
    onPlay: (event: Event) => {
        console.log(event, "onPlay")

        const callSetIsPlaying = scopeBind(setMediaStatus, {
            scope: getClientScope()!,
        })
        callSetIsPlaying("PLAYING")
    },
    onPlaying: (event: Event) => {
        console.log(event, "onPlaying")
        const callSetIsPlaying = scopeBind(setMediaStatus, {
            scope: getClientScope()!,
        })
        callSetIsPlaying("PLAYING")
    },
    onProgress: (e: Event) => {},
    onRateChange: (e: Event) => {},
    onSeeked: (e: Event) => {},
    onSeeking: (e: Event) => {},
    onStalled: (e: Event) => {},
    onSuspend: (e: Event) => {},
    onTimeUpdate: (event: Event) => {
        const audio = event.currentTarget as HTMLAudioElement

        const callSetCurrentTime = scopeBind(setCurrentTime, {
            scope: getClientScope()!,
        })

        callSetCurrentTime(audio.currentTime)
    },
    onVolumeChange: (event: Event) => {
        const audioElement = event.currentTarget as HTMLAudioElement
        const callSetVolume = scopeBind(setVolume, { scope: getClientScope()! })
        callSetVolume(audioElement.volume * 100)
    },
    onWaiting: (e: Event) => {},
}

const createAudioElement = (context: AudioContext, destination: GainNode) => {
    const audio = new Audio()
    audio.autoplay = false
    audio.controls = false

    // abort Событие вызывается , когда ресурс не был полностью загружен, но не в результате ошибки.
    audio.addEventListener("abort", Emitter.onAbort)
    // canplay Событие вызывается , когда агент пользователя может играть средства массовой информации, но, по оценкам, что не достаточно данных были загружены, чтобы играть средства массовой информации до его конца без остановки для дальнейшей буферизации контента.
    audio.addEventListener("canplay", Emitter.onCanPlay)
    // canplaythrough Событие вызывается , когда агент пользователя может играть средства массовой информации, и оценки , которые были загружены достаточно данных для воспроизведения медиа до его конца без остановки для дальнейшей буферизации контента.
    audio.addEventListener("canplaythrough", Emitter.onCanPlayThrough)
    // durationchange Событие вызывается , когда duration атрибут был обновлен.
    audio.addEventListener("durationchange", Emitter.onDurationChange)
    // emptied Событие вызывается , когда среда становится пустой; например, это событие отправляется, если носитель уже был загружен (или частично загружен) и load()вызывается метод для его перезагрузки.
    audio.addEventListener("emptied", Emitter.onEmptied)
    // ended Событие вызывается , когда воспроизведение или потоковое остановилось , потому что достигнут конец массовой информации или потому , что нет дополнительных данных не имеется.
    audio.addEventListener("ended", Emitter.onEnded)
    // error Событие вызывается , когда ресурс не может быть загружен из - за ошибки (например, проблемы подключения к сети).
    audio.addEventListener("error", Emitter.onError)
    // loadeddata Событие вызывается , когда кадр в текущей позиции воспроизведения средств массовой информации по окончанию загрузки; часто первый кадр.
    audio.addEventListener("loadeddata", Emitter.onLoadedData)
    // loadedmetadata Событие вызывается , когда метаданные были загружены.
    audio.addEventListener("loadedmetadata", Emitter.onLoadedMetadata)
    // loadstart Событие вызывается , когда браузер начал загружать ресурс.
    audio.addEventListener("loadstart", Emitter.onLoadStart)
    // pause Событие отправляется , когда запрос приостановить деятельность осуществляется и деятельность вошла в приостановленное состояние, чаще всего после того, как в средствах массовой информации было приостановлено через вызов элемента pause()метода.
    audio.addEventListener("pause", Emitter.onPause)
    // play Событие вызывается , когда paused свойство изменяется от true до false, в результате play метода, или autoplay атрибута.
    audio.addEventListener("play", Emitter.onPlay)
    // playing Событие вызывается после того, как воспроизведение первым начало, и всякий раз , когда он будет перезапущен. Например, он срабатывает, когда воспроизведение возобновляется после паузы или задержки из-за отсутствия данных.
    audio.addEventListener("playing", Emitter.onPlaying)
    // progress Событие вызывается периодически как браузер загружает ресурс.
    audio.addEventListener("progress", Emitter.onProgress)
    // ratechange Событие вызывается , когда скорость воспроизведения изменилась.
    audio.addEventListener("ratechange", Emitter.onRateChange)
    // seeked Событие вызывается , когда операция поиска завершена, текущая позиция воспроизведения изменилась, и булево seekingатрибут изменено false.
    audio.addEventListener("seeked", Emitter.onSeeked)
    // seeking Событие вызывается , когда начинаются искать операции, то есть булева seekingатрибут изменен trueи СМИ ищут новую позицию.
    audio.addEventListener("seeking", Emitter.onSeeking)
    // stalled Событие вызывается , когда агент пользователя пытается получать мультимедийные данные, но данные неожиданно не последовало.
    audio.addEventListener("stalled", Emitter.onStalled)
    // suspend Событие вызывается при загрузке мультимедийных данных было приостановлено.
    audio.addEventListener("suspend", Emitter.onSuspend)
    // timeupdate Событие вызывается , когда время , указанное в currentTimeатрибуте было обновлено.
    audio.addEventListener("timeupdate", Emitter.onTimeUpdate)
    // volumechange Событие вызывается , когда объем изменился.
    audio.addEventListener("volumechange", Emitter.onVolumeChange)
    // waiting Событие вызывается , когда воспроизведение остановлено из - за временного отсутствия данных.
    audio.addEventListener("waiting", Emitter.onWaiting)

    const _source = context.createMediaElementSource(audio)
    _source.connect(destination)
    return {
        _audio: audio,
        _source,
    }
}

const initWinamp = createEvent()
const destroyWinamp = createEvent()

const $Media = createStore<Nullable<MediaElement>>(null)

const createWinampFx = createEffect<any, any, any>(() => {
    const _context = new (window.AudioContext || window.webkitAudioContext)()
    const _staticSource = _context.createGain()
    const _balance = StereoBalanceNode(_context) as GainNode & StereoBalanceNodeType

    initbalace(_balance.balance.value)

    const _preamp = _context.createGain()

    const _analyser = _context.createAnalyser()
    _analyser.fftSize = 2048
    _analyser.smoothingTimeConstant = 0.0
    const _gainNode = _context.createGain()

    const { _audio, _source } = createAudioElement(_context, _staticSource)

    _staticSource.connect(_preamp)

    let output = _preamp

    let _bands: { [key in Band]: BiquadFilterNode } = {} as { [key in Band]: BiquadFilterNode }
    BANDS.forEach((band, i) => {
        const filter = _context.createBiquadFilter()

        _bands[band] = filter

        if (i === 0) {
            // The first filter, includes all lower frequencies
            filter.type = "lowshelf"
        } else if (i === BANDS.length - 1) {
            // The last filter, includes all higher frequencies
            filter.type = "highshelf"
        } else {
            filter.type = "peaking"
        }
        filter.frequency.value = band
        filter.gain.value = 0

        output.connect(filter)
        output = filter
    })

    output.connect(_balance)

    _balance.connect(_gainNode)
    _balance.connect(_analyser)
    _gainNode.connect(_context.destination)

    return {
        _context,
        _staticSource,
        _audio,
        _source,
        _balance,
        _preamp,
        _bands,
        _gainNode,
        _analyser,
    }
})

guard({
    clock: destroyWinamp,
    source: $Media,
    filter: (mediaSource, _): mediaSource is MediaElement =>
        mediaSource!._audio instanceof HTMLAudioElement,
    target: createEffect<MediaElement, any>((media) => {
        const { _audio: audio } = media

        audio.removeEventListener("abort", Emitter.onAbort)
        audio.removeEventListener("canplay", Emitter.onCanPlay)
        audio.removeEventListener("canplaythrough", Emitter.onCanPlayThrough)
        audio.removeEventListener("durationchange", Emitter.onDurationChange)
        audio.removeEventListener("emptied", Emitter.onEmptied)
        audio.removeEventListener("ended", Emitter.onEnded)
        audio.removeEventListener("error", Emitter.onError)
        audio.removeEventListener("loadeddata", Emitter.onLoadedData)
        audio.removeEventListener("loadedmetadata", Emitter.onLoadedMetadata)
        audio.removeEventListener("loadstart", Emitter.onLoadStart)
        audio.removeEventListener("pause", Emitter.onPause)
        audio.removeEventListener("play", Emitter.onPlay)
        audio.removeEventListener("playing", Emitter.onPlaying)
        audio.removeEventListener("progress", Emitter.onProgress)
        audio.removeEventListener("ratechange", Emitter.onRateChange)
        audio.removeEventListener("seeked", Emitter.onSeeked)
        audio.removeEventListener("seeking", Emitter.onSeeking)
        audio.removeEventListener("stalled", Emitter.onStalled)
        audio.removeEventListener("suspend", Emitter.onSuspend)
        audio.removeEventListener("timeupdate", Emitter.onTimeUpdate)
        audio.removeEventListener("volumechange", Emitter.onVolumeChange)
        audio.removeEventListener("waiting", Emitter.onWaiting)
        audio.load()

        media._source.disconnect()
    }),
})

//initial $Media source
sample({
    clock: initWinamp,
    target: createWinampFx,
})

sample({
    clock: createWinampFx.doneData,
    fn: (media) => media,
    target: $Media,
})

//function has load track in Media._audio
const loadUrl = createEvent<string>()
sample({
    clock: loadUrl,
    source: $Media,
    fn: (media, url) => ({ media, url }),
    target: createEffect(({ media, url }: { media: Nullable<MediaElement>; url: string }) => {
        media!._audio.src = url
        media!._audio.play()
    }),
})

const setMediaStatus = createEvent<MediaStatus>()
const $mediaStatus = createStore<MediaStatus>("STOPPED").on(setMediaStatus, (_, status) => status)

const toggleLoop = createEvent()
const $loop = createStore<boolean>(false).on(toggleLoop, (state, _) => !state)

//toggle loop from ui
guard({
    clock: $loop,
    source: [$Media, $loop],
    filter: (params): params is [MediaElement, boolean] => params[0] instanceof HTMLAudioElement,
    target: createEffect<[MediaElement, boolean], void>(([media, loop]) => {
        media._audio.loop = loop
    }),
})

const addTrackToPlaylist = createEvent<Song>()
const removeTrackFromPlaylist = createEvent<number>()

const selectTrackFromList = createEvent<Song>()

const $currentTrack = createStore<Nullable<Song>>(null).on(selectTrackFromList, (_, track) => track)

const playTrackAfterSelectFromList = guard({
    clock: $currentTrack,
    source: $currentTrack,
    filter: (currentTrack) => currentTrack !== null,
})

sample({
    clock: playTrackAfterSelectFromList,
    source: $currentTrack,
    fn: (track, _) => `${process.env.NEXT_PUBLIC_BACKEND}/music/${track!.path}`,
    target: loadUrl,
})

const $playList = createStore<Song[]>([])
    .on(selectTrackFromList, (_, track) => [track])
    .on(addTrackToPlaylist, (tracks, track) => [...tracks, track])
    .on(removeTrackFromPlaylist, (tracks, id) => tracks.filter((track, index) => index !== id))

const $playListLength = $playList.map((state) => state.length)

const selectTrackInPlayList = createEvent<number>()

const $selectedTrackInPlayList = createStore<Nullable<number>>(null).on(
    selectTrackInPlayList,
    (_, id) => id
)

const onDoubleClickedTrackInPlaylist = createEvent<number>()

const $currentPlayedTrackIndexPlaylist = createStore<Nullable<number>>(null)
    .on(selectTrackFromList, () => 0)
    .on(onDoubleClickedTrackInPlaylist, (_, id) => id)

sample({
    clock: $currentPlayedTrackIndexPlaylist,
    source: $playList,
    fn: (playlist, id) => playlist[id!],
    target: $currentTrack,
})

//when track ended check next track in playlist exists
const checkNextTrack = createEvent()
// checking playlist is emtpy state

const checkNextTrackInPlaylistQuene = guard({
    clock: checkNextTrack,
    source: $playListLength,
    filter: (playlistLength, _) => playlistLength > 0,
})
//when playlist is not empty check currentTrackIndex in playlist if not last put next, otherwise put first
const selectNextTrackInPlaylistQueue = sample({
    clock: checkNextTrackInPlaylistQuene,
    source: $currentPlayedTrackIndexPlaylist,

    fn: (currentIndex, playListLength) => {
        const lastTrack = currentIndex === playListLength - 1

        if (lastTrack) return 0
        return currentIndex! + 1
    },
})

//set new Track index in currentPlayedTrackIndexPlaylist
sample({
    clock: selectNextTrackInPlaylistQueue,
    fn: (newTrackIndex) => newTrackIndex,
    target: $currentPlayedTrackIndexPlaylist,
})

//setting new Track in CurrentTrack
sample({
    clock: $currentPlayedTrackIndexPlaylist,
    source: $playList,
    fn: (playlist, newTrackIndex) => playlist[newTrackIndex!],
    target: $currentTrack,
})

//Timing

const toggleTimeMode = createEvent()
const $timeMode = createStore<TIME_MODE>(TIME_MODE.ELAPSED).on(toggleTimeMode, (state, _) =>
    state === TIME_MODE.ELAPSED ? TIME_MODE.REMAINING : TIME_MODE.ELAPSED
)

const setDuration = createEvent<number>()
const $currentTrackDuration = createStore<number>(0).on(setDuration, (_, duration) => duration)

//seeking in progressBar
const onmousedown = createEvent<MouseEvent<HTMLInputElement>>()
const onmouseup = createEvent<MouseEvent<HTMLInputElement>>()
const $allowSeeking = createStore<boolean>(true)
    .on(onmousedown, () => false)
    .on(onmouseup, () => true)

const $currentTime = createStore<number>(0).reset($currentTrack)

const $seekingProgress = createStore<number>(0).reset($currentTrack)

const setCurrentTime = createEvent<number>() //form ui
const changeCurrentTime = createEvent<number>() //from emitter

const seekingCurrentTime = createEvent<ChangeEvent<HTMLInputElement>>()
$seekingProgress.on(seekingCurrentTime, (_, event) => Number(event.target.value))

//when seeking time is end then temporary value set in currentTime
sample({
    clock: onmouseup,
    source: $seekingProgress,
    target: changeCurrentTime,
})

$currentTime.on($seekingProgress, (_, seekedTime) => seekedTime)

guard({
    source: setCurrentTime,
    filter: $allowSeeking,
    target: $currentTime,
})

//changing current Time from ui
guard({
    source: sample({
        clock: changeCurrentTime,
        source: [$Media, $allowSeeking],
        // @ts-ignore
        fn: ([media, allowSeeking], event) => [media!._audio, event, allowSeeking],
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

const keyChangeCurrentTime = createEvent<string>() //changing time in keypress

//change current position in track with keypres +5 -5 seconds
guard({
    source: sample({
        clock: keyChangeCurrentTime,
        source: [$Media, $allowSeeking],
        // @ts-ignore
        fn: ([media, allowSeeking], event) => [media!._audio, event, allowSeeking],
    }),
    filter: (sourceTuple): sourceTuple is [HTMLAudioElement, string, boolean] =>
        sourceTuple[0] instanceof HTMLAudioElement && sourceTuple[2] === true,
    target: createEffect<[HTMLAudioElement, string, boolean], void>(
        ([audio, event, allowSeeking]) => {
            if (event === "forward") {
                audio.currentTime = audio.currentTime + 5
            }
            if (event === "backward") {
                audio.currentTime = audio.currentTime - 5
            }
        }
    ),
})

const $durationTracksInPlaylist = createStore<number>(0).on($playList, (_, tracks) => {
    let initDuration = 0
    const currentDuration = tracks.reduce(
        (acc, current) => acc + current.metaData.format.duration,
        initDuration
    )
    return currentDuration
})
//timer for UI

//remaining time in current Track
const $currentTrackTimeRemaining = createStore<number>(0).reset($currentTrack)

sample({
    clock: $currentTime,
    source: $currentTrackDuration,
    fn: (duration, currentTime) => duration - currentTime,
    target: $currentTrackTimeRemaining,
})

const $timer = createStore<Record<string, number>>({
    firstSecond: 0,
    lastSecond: 0,
    firstMinute: 0,
    lastMinute: 0,
})

const convertCurrentTimeToTimerFx = createEffect<[number, TIME_MODE], Record<string, number>>(
    ([currentTime, timeMode]) => {
        const seconds = currentTime % 60
        const minutes = Math.floor(currentTime / 60)

        const firstSecond = Math.floor(seconds / 10)
        const lastSecond = Math.floor(seconds % 10)
        const firstMinute = Math.floor(minutes / 10)
        const lastMinute = Math.floor(minutes % 10)

        return {
            firstSecond,
            lastSecond,
            firstMinute,
            lastMinute,
        }
    }
)

guard({
    clock: $currentTime,
    source: [$currentTime, $timeMode],
    filter: ([currentTime, timeMode]: [number, TIME_MODE], _: number) =>
        timeMode === TIME_MODE.ELAPSED,
    target: convertCurrentTimeToTimerFx,
})

guard({
    clock: $currentTrackTimeRemaining,
    source: [$currentTrackTimeRemaining, $timeMode],
    filter: ([currentTime, timeMode]: [number, TIME_MODE], _: number) =>
        timeMode === TIME_MODE.REMAINING,
    target: convertCurrentTimeToTimerFx,
})

sample({
    clock: convertCurrentTimeToTimerFx.doneData,
    fn: (timer) => timer,
    target: $timer,
})

//Volume
const setVolume = createEvent<number>()
const changeVolume = createEvent<ChangeEvent<HTMLInputElement>>()
const $volume = createStore<number>(50).on(setVolume, (_, volume) => volume)

//change Volume from UI
guard({
    source: sample({
        clock: changeVolume,
        source: $Media,
        fn: (media, event) => [media?._audio, event],
    }),
    filter: (sourceTuple): sourceTuple is [HTMLAudioElement, ChangeEvent<HTMLInputElement>] =>
        sourceTuple[0] instanceof HTMLAudioElement,
    target: createEffect<[HTMLAudioElement, ChangeEvent<HTMLInputElement>], void>(
        ([audio, event]) => {
            audio.volume = Number(event.target.value) / 100
        }
    ),
})

//reset volume to default from ui
const resetVolume = createEvent()
guard({
    source: sample({ clock: resetVolume, source: $Media, fn: (media) => [media!._audio] }),
    filter: (sourceTuple): sourceTuple is [HTMLAudioElement] =>
        sourceTuple[0] instanceof HTMLAudioElement,
    target: createEffect<[HTMLAudioElement], void>(([audio]) => {
        audio.volume = 0.5
    }),
})

//Controls

const onPlayClicked = createEvent()

const playFromBeginning = guard({
    clock: onPlayClicked,
    source: $mediaStatus,
    filter: (status) => status === "PLAYING",
})

guard({
    clock: playFromBeginning,
    source: $Media,
    filter: (Media): Media is MediaElement => Media?._audio instanceof HTMLAudioElement,
    target: createEffect<MediaElement, void>(({ _audio }) => {
        _audio.currentTime = 0
    }),
})

const resumePlaying = guard({
    clock: onPlayClicked,
    source: $mediaStatus,
    filter: (mediaStatus) => mediaStatus !== "PLAYING",
})

guard({
    clock: resumePlaying,
    source: $Media,
    filter: (Media): Media is MediaElement => Media?._audio instanceof HTMLAudioElement,
    target: createEffect<MediaElement, void>(({ _audio }) => _audio.play()),
})
const onPauseClicked = createEvent()

guard({
    clock: onPauseClicked,
    source: $Media,
    filter: (Media): Media is MediaElement => Media?._audio instanceof HTMLAudioElement,
    target: createEffect<MediaElement, void>(({ _audio }) => _audio.pause()),
})

const onStopButtonClicked = createEvent<MediaStatus>()
const onStopButtonClickedFx = createEffect<MediaElement, void>(({ _audio }) => {
    _audio.pause()
    _audio.currentTime = 0
})

guard({
    clock: onStopButtonClicked,
    source: $Media,
    filter: (Media, _): Media is MediaElement => Media?._audio instanceof HTMLAudioElement,
    target: onStopButtonClickedFx,
})

sample({
    clock: onStopButtonClickedFx.done,
    fn: () => "STOPPED" as MediaStatus,
    target: $mediaStatus,
})

const nextTrackClicked = createEvent()

const checkNextTrackClicked = guard({
    clock: nextTrackClicked,
    source: $playListLength,
    filter: (playListLength, _) => playListLength > 0,
})

sample({
    clock: checkNextTrackClicked,
    source: [$playListLength, $currentPlayedTrackIndexPlaylist],
    fn: ([tracksIds, currentTrackId], _) => {
        if (currentTrackId! === tracksIds! - 1) return 0
        return currentTrackId! + 1
    },
    target: $currentPlayedTrackIndexPlaylist,
})

const prevTrackClicked = createEvent()
const checkPrevTrackClicked = guard({
    clock: prevTrackClicked,
    source: $playListLength,
    filter: (playListLength, _) => playListLength > 0,
})

sample({
    clock: checkPrevTrackClicked,
    source: [$playList, $currentPlayedTrackIndexPlaylist],
    fn: ([playList, currentTrackId], _) => {
        // @ts-ignore: types error
        if (currentTrackId === 0) return playList.length - 1
        // @ts-ignore: types error
        return currentTrackId - 1
    },
    target: selectTrackInPlayList,
})

//balance Control

const initbalace = (value: number) => {
    const callSetBalance = scopeBind(setBalance, { scope: getClientScope()! })
    callSetBalance(value * 100)
}

const setBalance = createEvent<number>()
const changeBalance = createEvent<ChangeEvent<HTMLInputElement>>()
const resetBalance = createEvent()
const $currentBalance = createStore<number>(0)
    .on(setBalance, (_, newBalance) => newBalance)
    .reset(resetBalance)
//change balance from ui
sample({
    clock: changeBalance,
    source: $Media,
    fn: (media, event) => [media, event] as [Nullable<MediaElement>, ChangeEvent<HTMLInputElement>],
    target: createEffect<[Nullable<MediaElement>, ChangeEvent<HTMLInputElement>], void>(
        ([media, event]) => {
            media!._balance.balance.value = Number(event.target.value) / 100
        }
    ),
})

sample({
    clock: resetBalance,
    source: $Media,
    fn: (Media, _) => Media,
    target: createEffect<Nullable<MediaElement>, void>((media) => {
        media!._balance.balance.value = 0
    }),
})

sample({
    clock: changeBalance,
    fn: (event) => Number(event.target.value),

    target: setBalance,
})

//EQ

//turn off EQ in UI
const disableClickedEQ = createEvent()

const disableEQFx = createEffect<MediaElement, void>((media) => {
    media._staticSource.disconnect()
    media._staticSource.connect(media._balance)
})

guard({
    clock: disableClickedEQ,
    source: $Media,
    filter: (media, _): media is MediaElement => media?._audio instanceof HTMLAudioElement,
    target: disableEQFx,
})
// turn on EQ in UI
const enableClickedEQ = createEvent()

const enableEQFx = createEffect<MediaElement, void>((media) => {
    media._staticSource.disconnect()
    media._staticSource.connect(media._preamp)
})

guard({
    clock: enableClickedEQ,
    source: $Media,
    filter: (media, _): media is MediaElement => media?._audio instanceof HTMLAudioElement,
    target: enableEQFx,
})

sample({
    clock: [enableEQFx.done, disableEQFx.done],
    target: toggleEnabledEQ,
})

//ui change EQ Band
const changeEQBand = createEvent<ChangeEvent<HTMLInputElement>>()

const setEQbandFx = createEffect<
    [MediaElement, ChangeEvent<HTMLInputElement>],
    ChangeEvent<HTMLInputElement>
>(([media, event]) => {
    const { value, name } = event.target
    const bandName = Number(name) as keyof _BANDS
    const db = (Number(value) / 100) * 24 - 12

    media!._bands[bandName].gain.value = db

    return event
})

sample({
    clock: changeEQBand,
    source: $Media,
    fn: (media, event) => [media, event] as [MediaElement, ChangeEvent<HTMLInputElement>],
    target: setEQbandFx,
})

sample({
    clock: setEQbandFx.doneData,
    source: $frequency,
    fn: (frequency, event) => ({ ...frequency, [event.target.name]: Number(event.target.value) }),
    target: $frequency,
})

//set MAX BANDS in UI

const changeAllBandsValues = createEvent<string>()

const setMaxMinResetValuesBandsFx = createEffect<[MediaElement, string], string>(
    ([media, event]) => {
        let db = 0
        switch (event) {
            case "max":
                db = 12
                break
            case "min":
                db = -12
                break
            case "reset":
                db = 0
                break
            default:
                break
        }
        Object.entries(media._bands).forEach(([key, band]) => {
            band.gain.value = db
        })
        return event
    }
)

sample({
    clock: changeAllBandsValues,
    source: $Media,
    fn: (media, event) => [media, event] as [MediaElement, string],
    target: setMaxMinResetValuesBandsFx,
})

$frequency.on(setMaxMinResetValuesBandsFx.doneData, (state, event) => {
    let newValue = 0
    switch (event) {
        case "min":
            newValue = -100
            break
        case "max":
            newValue = 100
            break
        case "reset":
            newValue = 50
            break
        default:
            break
    }
    let result: any = {}
    Object.entries(state).forEach(([key, band]) => {
        result = { ...result, [key]: newValue }
    })
    return result
})

export const balance = {
    $currentBalance,
    changeBalance,
    resetBalance,
}

export const winampControls = {
    play: onPlayClicked,
    pause: onPauseClicked,
    stop: onStopButtonClicked,
    prevTrack: prevTrackClicked,
    nextTrack: nextTrackClicked,
    toggleLoop,
}

export const playlist = {
    doubleClick: onDoubleClickedTrackInPlaylist,
    $playList,
    $selectedTrackInPlayList,
    selectTrack: selectTrackInPlayList,
    $currentPlayedTrackIndexPlaylist,
    addTrackToPlaylist,
}

export const progress = {
    $currentTime,
    seekingCurrentTime,
    $seekingProgress,
    $currentTrackTimeRemaining,
    keyChangeCurrentTime,
    $allowSeeking,
    onmousedown,
    onmouseup,
    $timer,
}

export const volume = {
    $volume,
    resetVolume,
    changeVolume,
}

export const duration = {
    $durationTracksInPlaylist,
    $currentTrackDuration,
}

export const winamp = {
    init: initWinamp,
    destroy: destroyWinamp,
    $mediaStatus,
    $currentTrack,
    selectTrackFromList,
    $timeMode,
    toggleTimeMode,
    $loop,
}

export const winampWindowsState = {
    activeWindow: "",
    playlistWindowState: "",
    eqWindowState: "",
    playerWindowState: "",
}

export const eq = {
    changeAllBandsValues,
}

$Media.watch(console.log)

export const $baseSkinColors = createStore<string[]>(baseSkinColors)

export { loadUrl, selectTrackFromList, $Media, changeEQBand, disableClickedEQ, enableClickedEQ }

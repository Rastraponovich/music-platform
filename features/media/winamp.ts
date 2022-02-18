import { getClientScope, useScope } from "@/hooks/useScope"
import { Nullable } from "@/types"
import { baseSkinColors } from "@/types/ui.types"
import { sample, createEffect, createEvent, createStore, guard, scopeBind, split } from "effector"
import { debug, delay } from "patronum"
import { ChangeEvent, MouseEvent } from "react"
import { $songs } from "../music"
import { BANDS, MEDIA_STATUS, WINAMP_STATE, WINAMP_WINDOW_STATE } from "../music/constants"
import { createEQFactory } from "../music/winamp-eq"
import {
    Band,
    Track,
    TIME_MODE,
    TWinampState,
    TWinampWindow,
    MediaElement,
    StereoBalanceNodeType,
    _BANDS,
    TMediaStatus,
} from "../music/types"
import StereoBalanceNode from "./StereoBalanceNode"
import { createWinampProgressFactory } from "../music/winamp-progress"

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
        const callSetDuration = scopeBind(winampProgress.setDuration, { scope: getClientScope()! })
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
    onLoadStart: (event: Event) => {},
    onPause: (event: Event) => {
        const callSetIsPlaying = scopeBind(setMediaStatus, {
            scope: getClientScope()!,
        })
        callSetIsPlaying("PAUSED")
    },
    onPlay: (event: Event) => {
        const callSetIsPlaying = scopeBind(setMediaStatus, {
            scope: getClientScope()!,
        })
        callSetIsPlaying("PLAYING")
    },
    onPlaying: (event: Event) => {
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

        const callSetCurrentTime = scopeBind(winampProgress.setCurrentTime, {
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
    audio.autoplay = true
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

const closeWinamp = createEvent()

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

const equalizer = createEQFactory($Media)

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
        audio.pause()

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

const $winampState = createStore<TWinampState>(WINAMP_STATE.DESTROYED).on(
    initWinamp,
    () => WINAMP_STATE.INIT
)

const $visiblePlayer = createStore<boolean>(false)

//function has load track in Media._audio
const loadUrl = createEvent<string>()
sample({
    clock: loadUrl,
    source: $Media,
    fn: (media, url) => ({ media, url }),
    target: createEffect(({ media, url }: { media: Nullable<MediaElement>; url: string }) => {
        media!._audio.src = url
    }),
})

const setMediaStatus = createEvent<TMediaStatus>()
const $mediaStatus = createStore<TMediaStatus>(MEDIA_STATUS.STOPPED).on(
    setMediaStatus,
    (_, status) => status
)

const onStopped = sample({
    clock: $mediaStatus,
    filter: (status) => status === MEDIA_STATUS.STOPPED,
})

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

const toggleShuffle = createEvent()
const $shuffle = createStore<boolean>(false).on(toggleShuffle, (state, _) => !state)

const addTrackToPlaylist = createEvent<Track>()
const removeTrackFromPlaylist = createEvent<number>()

const selectTrackFromList = createEvent<Track>()

$winampState.on(selectTrackFromList, () => WINAMP_STATE.TRACKLOADED)

const toggleVisiblePlaylist = createEvent()
const $visiblePlaylist = createStore<boolean>(false).on(toggleVisiblePlaylist, (state, _) => !state)

const checkInitWinamp = guard({
    clock: selectTrackFromList,
    source: $winampState,
    filter: (state, _) => state === WINAMP_STATE.INIT,
})

sample({
    clock: checkInitWinamp,
    fn: () => WINAMP_STATE.TRACKLOADED,
    target: $winampState,
})

debug(checkInitWinamp, $winampState)

const checkLoadedFirstTrack = guard({
    clock: $winampState,
    filter: (state) => state === WINAMP_STATE.TRACKLOADED,
})

sample({
    clock: checkLoadedFirstTrack,
    fn: () => true,
    target: [equalizer.$visibleEQ, $visiblePlaylist, $visiblePlayer],
})

const checkDestroyWinamp = guard({
    clock: $winampState,
    filter: (state) => state === WINAMP_STATE.DESTROYED,
})

sample({
    clock: checkDestroyWinamp,
    fn: () => false,
    target: [$visiblePlaylist, equalizer.$visibleEQ, $visiblePlayer],
})

const $currentTrack = createStore<Nullable<Track>>(null).on(
    selectTrackFromList,
    (_, track) => track
)

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

const $playList = createStore<Track[]>([])
    .on(selectTrackFromList, (_, track) => [track])
    .on(addTrackToPlaylist, (tracks, track) => [...tracks, track])
    .on(removeTrackFromPlaylist, (tracks, id) => tracks.filter((track, index) => index !== id))

const $playListLength = $playList.map((state) => state.length)

const highlightTrackInPlaylist = createEvent<number>()

const $selectedTrackInPlayList = createStore<Nullable<number>>(null)
    .on(highlightTrackInPlaylist, (_, id) => id)
    .reset(removeTrackFromPlaylist)

const onDoubleClickedTrackInPlaylist = createEvent<number>()

const setCcurrentPlayedTrackIndexPlaylist = createEvent<number>()

const $currentPlayedTrackIndexPlaylist = createStore<Nullable<number>>(null)
    .on(selectTrackFromList, () => 0)
    .on(onDoubleClickedTrackInPlaylist, (_, id) => id)
    .on(setCcurrentPlayedTrackIndexPlaylist, (_, id) => id)

const $removedTrackId = createStore<Nullable<number>>(null)
    .on(removeTrackFromPlaylist, (_, id) => id)
    .reset([selectTrackFromList, $currentTrack])

const decrementCurrentPlayedIndex = guard({
    clock: removeTrackFromPlaylist,
    source: $currentPlayedTrackIndexPlaylist,
    filter: (currentIndex, removedIndex) => {
        if (currentIndex === removedIndex) return false
        if (currentIndex !== null) {
            if (currentIndex > removedIndex) return true
        }
        return false
    },
})

sample({
    clock: decrementCurrentPlayedIndex,
    source: $currentPlayedTrackIndexPlaylist,
    fn: (currentIndex, _) => currentIndex! - 1,
    target: $currentPlayedTrackIndexPlaylist,
})

sample({
    clock: $currentPlayedTrackIndexPlaylist,
    source: $playList,
    fn: (playlist, id) => playlist[id!],
    target: $currentTrack,
})

const startPlayFromBegginingFx = createEffect<MediaElement, void>((media) => {
    media._audio.currentTime = 0
})

//when track ended check next track in playlist exists
const checkNextTrack = createEvent()
// checking playlist is emtpy state

const checkNextTrackInPlaylistQuene = guard({
    clock: checkNextTrack,
    source: $playListLength,
    filter: (playlistLength, _) => playlistLength > 0,
})

const whenShuffleOn = guard({
    clock: checkNextTrackInPlaylistQuene,
    source: $shuffle,
    filter: (shuffle, _) => shuffle,
})
const whenShuffleOff = guard({
    clock: checkNextTrackInPlaylistQuene,
    source: $shuffle,
    filter: (shuffle, _) => !shuffle,
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
    target: setCcurrentPlayedTrackIndexPlaylist,
})

//setting new Track in CurrentTrack
sample({
    clock: $currentPlayedTrackIndexPlaylist,
    source: $playList,
    fn: (playlist, newTrackIndex) => ({ ...playlist[newTrackIndex!] }),
    target: $currentTrack,
})
debug($playList)

//Timing

// const toggleTimeMode = createEvent()
// const $timeMode = createStore<TIME_MODE>(TIME_MODE.ELAPSED).on(toggleTimeMode, (state, _) =>
//     state === TIME_MODE.ELAPSED ? TIME_MODE.REMAINING : TIME_MODE.ELAPSED
// )

const winampProgress = createWinampProgressFactory($Media, $currentTrack)

const $durationTracksInPlaylist = createStore<number>(0).on($playList, (_, tracks) => {
    let initDuration = 0
    const currentDuration = tracks.reduce(
        (acc, current) => acc + current.metaData.format.duration,
        initDuration
    )
    return currentDuration
})
//timer for UI

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
    filter: (status) => status === MEDIA_STATUS.PLAYING,
})

guard({
    clock: playFromBeginning,
    source: $Media,
    filter: (Media): Media is MediaElement => Media?._audio instanceof HTMLAudioElement,
    target: startPlayFromBegginingFx,
})

const resumePlaying = guard({
    clock: onPlayClicked,
    source: $mediaStatus,
    filter: (mediaStatus) => mediaStatus !== MEDIA_STATUS.PLAYING,
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

const onStopButtonClicked = createEvent<TMediaStatus>()

sample({
    clock: onStopButtonClicked,
    fn: () => MEDIA_STATUS.STOPPED,
    target: $mediaStatus,
})

const stopPlayingFx = createEffect<MediaElement, void>(({ _audio }) => {
    _audio.pause()
    _audio.currentTime = 0
})

guard({
    clock: onStopped,
    source: $Media,
    filter: (Media, _): Media is MediaElement => Media?._audio instanceof HTMLAudioElement,
    target: stopPlayingFx,
})

// const delayedStopButtonClicked = delay({
//     source: onStopButtonClicked,
//     timeout: 300,
//     target: $mediaStatus,
// })

sample({
    clock: onDoubleClickedTrackInPlaylist,
    fn: () => MEDIA_STATUS.STOPPED,
    target: $mediaStatus,
})

sample({
    clock: onDoubleClickedTrackInPlaylist,
    source: $Media,
    fn: (media, _) => media as MediaElement,
    target: startPlayFromBegginingFx,
})

sample({ clock: startPlayFromBegginingFx.done, target: onPlayClicked })

const nextTrackClicked = createEvent()

const checkNextTrackClicked = guard({
    clock: nextTrackClicked,
    source: $playListLength,
    filter: (playListLength, _) => playListLength > 0,
})

const playNextTrackNoShuffle = guard({
    clock: checkNextTrackClicked,
    source: $shuffle,
    filter: (shuffle, _) => !shuffle,
})

sample({
    clock: playNextTrackNoShuffle,
    source: [$playListLength, $currentPlayedTrackIndexPlaylist],
    fn: ([playListLength, currentTrackId], _) => {
        if (currentTrackId! === playListLength! - 1) return 0
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

const playPrevTrackNoShuffle = guard({
    clock: checkPrevTrackClicked,
    source: $shuffle,
    filter: (shuffle, _) => !shuffle,
})

sample({
    clock: playPrevTrackNoShuffle,
    source: [$playList, $currentPlayedTrackIndexPlaylist],
    fn: ([playList, currentTrackId], _) => {
        // @ts-ignore: types error
        if (currentTrackId === 0) return playList.length - 1
        // @ts-ignore: types error
        return currentTrackId - 1
    },
    target: $currentPlayedTrackIndexPlaylist,
})

const playNextShuffledTrack = guard({
    clock: [checkNextTrackClicked, checkPrevTrackClicked],
    source: $shuffle,
    filter: (shuffle, _) => shuffle,
})

sample({
    clock: playNextShuffledTrack,
    source: [$playListLength, $currentPlayedTrackIndexPlaylist],
    fn: ([playListLength, currentTrack], _) => {
        const max = playListLength!

        const generateRandom = (max: number, exp: number) => {
            let number
            while (true) {
                number = Math.floor(Math.random() * max)

                if (number != exp) {
                    return number
                }
            }
        }
        const result = generateRandom(max, currentTrack!)

        return result
    },
    target: $currentPlayedTrackIndexPlaylist,
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

/** ------------work with window winamp---------- */

//closing Winamp

sample({
    clock: closeWinamp,
    fn: () => MEDIA_STATUS.STOPPED,
    target: onStopButtonClicked,
})

sample({
    clock: closeWinamp,
    fn: () => WINAMP_STATE.CLOSED,
    target: $winampState,
})

sample({
    clock: $winampState,
    filter: (state) => state === WINAMP_STATE.CLOSED,
    fn: () => false,
    target: [equalizer.$visibleEQ, $visiblePlayer, $visiblePlaylist],
})

sample({
    clock: $winampState,
    filter: (state) => state === WINAMP_STATE.OPENED,
    fn: () => true,
    target: [equalizer.$visibleEQ, $visiblePlayer, $visiblePlaylist],
})

//winamp window active state

const changeWindowState = createEvent<TWinampWindow>()
const $activeWindow = createStore<TWinampWindow>(WINAMP_WINDOW_STATE.NONE)
    .on(changeWindowState, (_, currentWindow) => currentWindow)
    .reset([closeWinamp, selectTrackFromList])

const showWinamp = createEvent()

sample({
    clock: showWinamp,
    source: $currentTrack,
    filter: (currentTrack, _) => currentTrack === null,
    fn: () => WINAMP_STATE.OPENED,
    target: $winampState,
})

sample({
    clock: showWinamp,
    source: $currentTrack,
    filter: (currentTrack, _) => currentTrack !== null,
    fn: () => WINAMP_STATE.TRACKLOADED,
    target: $winampState,
})

const playAllTracksFromList = createEvent()

sample({
    clock: playAllTracksFromList,
    source: $songs,
    fn: (songs, _) => songs,
    target: $playList,
})

sample({
    clock: playAllTracksFromList,
    fn: () => 0,
    target: $currentPlayedTrackIndexPlaylist,
})

sample({
    clock: playAllTracksFromList,
    target: showWinamp,
})

guard({
    clock: playAllTracksFromList,
    source: $mediaStatus,
    filter: (state, _) => state !== MEDIA_STATUS.PLAYING,
    target: onPlayClicked,
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
    toggleShuffle,
    toggleLoop,
}

export const playlist = {
    doubleClick: onDoubleClickedTrackInPlaylist,
    $playListLength,
    $playList,
    $selectedTrackInPlayList,
    highlightTrackInPlaylist,
    $currentPlayedTrackIndexPlaylist,
    addTrackToPlaylist,
    $visiblePlaylist,
    toggleVisiblePlaylist,
    removeTrackFromPlaylist,
}

export const progress = {
    $currentTime: winampProgress.$currentTime,
    seekingCurrentTime: winampProgress.seekingCurrentTime,
    $seekingProgress: winampProgress.$seekingProgress,
    $currentTrackTimeRemaining: winampProgress.$currentTrackTimeRemaining,
    keyChangeCurrentTime: winampProgress.keyChangeCurrentTime,
    $allowSeeking: winampProgress.$allowSeeking,
    onmousedown: winampProgress.onmousedown,
    onmouseup: winampProgress.onmouseup,
    $timer: winampProgress.$timer,
}

export const volume = {
    $volume,
    resetVolume,
    changeVolume,
}

export const duration = {
    $durationTracksInPlaylist,
    $currentTrackDuration: winampProgress.$currentTrackDuration,
}

export const winamp = {
    init: initWinamp,
    destroy: destroyWinamp,
    close: closeWinamp,
    show: showWinamp,
    $mediaStatus,
    $currentTrack,
    selectTrackFromList,
    playAllTracksFromList,
    $timeMode: winampProgress.$timeMode,
    toggleTimeMode: winampProgress.toggleTimeMode,
    $loop,
    $shuffle,
}

export const winampStates = {
    $winampState,
    playlistWindowState: "",
    eqWindowState: "",
    playerWindowState: "",
    $activeWindow,
    changeWindowState,
    $visiblePlayer,
}

export const eq = {
    changeAllBandsValues: equalizer.changeAllBandsValues,
    changePreampValue: equalizer.changePreampValue,
    changeEQBand: equalizer.changeEQBand,
    disableClickedEQ: equalizer.disableClickedEQ,
    enableClickedEQ: equalizer.enableClickedEQ,
    resetEqBand: equalizer.resetEqBand,
    $auto: equalizer.$autoEQ,
    $enabled: equalizer.$enabledEQ,
    $preamp: equalizer.$preamp,
    $bands: equalizer.$bands,
    $visibleEQ: equalizer.$visibleEQ,
    toggleVisibleEQ: equalizer.toggleVisibleEQ,
    toggleAutoEQ: equalizer.toggleAutoEQ,
    $minimized: equalizer.$minimizedEQ,
    toggleMinimized: equalizer.toggleMinimizeEQ,
}

export const $baseSkinColors = createStore<string[]>(baseSkinColors)

export { loadUrl, selectTrackFromList, $Media }

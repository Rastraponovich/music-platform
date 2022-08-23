import { getClientScope } from "@/hooks/useScope"
import { Nullable } from "@/types"
import { baseSkinColors } from "@/types/ui.types"
import { sample, createEffect, createEvent, createStore, guard, scopeBind, forward } from "effector"

import { $songs } from "../music"
import { BANDS, MEDIA_STATUS, WINAMP_STATE, WINAMP_WINDOW_STATE } from "../music/constants"
import {
    Band,
    Track,
    TWinampState,
    TWinampWindow,
    MediaElement,
    StereoBalanceNodeType,
    _BANDS,
    TMediaStatus,
} from "../music/types"
import StereoBalanceNode from "./StereoBalanceNode"
import { createWinampVolumeFactory } from "../music/winamp-volume"
import { createWinampPlaylistFactory } from "../music/winamp-playlist"
import { createWinampEQFactory } from "../music/winamp-eq"
import { createWinampProgressFactory } from "../music/winamp-progress"

import { createWinampBalanceFactory } from "../music/winamp-balance"
import { debug } from "patronum"
import { convertTimeToString, _snapBandValue } from "@/utils/utils"
declare global {
    interface Window {
        webkitAudioContext: {
            new (contextOptions?: AudioContextOptions | undefined): AudioContext
            prototype: AudioContext
        }
    }
}

const startPlayFromBegginingFx = createEffect<MediaElement, void>((media) => {
    media._audio.currentTime = 0
})

const startPlayingFx = createEffect<MediaElement, void>((media) => {
    media._audio.play()
})

const pausePlayingFx = createEffect<MediaElement, void>(({ _audio }) => _audio.pause())

const stopPlayingFx = createEffect<MediaElement, void>(({ _audio }) => {
    _audio.pause()
    _audio.currentTime = 0
})

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
        const callPlayNextTrack = scopeBind(playNextTrack, { scope: getClientScope()! })
        callPlayNextTrack()
    },
    onError: (e: Event) => {},
    onLoadedData: (e: Event) => {},
    onLoadedMetadata: (event: Event) => {
        const audioElement = event.currentTarget as HTMLAudioElement
        const callSetVolume = scopeBind(setVolume, { scope: getClientScope()! })
        callSetVolume(audioElement.volume * 100)
    },
    onLoadStart: (event: Event) => {},
    onPause: (event: Event) => {
        const callSetIsPlaying = scopeBind(setMediaStatus, {
            scope: getClientScope()!,
        })
        callSetIsPlaying(MEDIA_STATUS.PAUSED)
    },
    onPlay: (event: Event) => {
        const callSetIsPlaying = scopeBind(setMediaStatus, {
            scope: getClientScope()!,
        })
        callSetIsPlaying(MEDIA_STATUS.PLAYING)
    },
    onPlaying: (event: Event) => {
        const callSetIsPlaying = scopeBind(setMediaStatus, {
            scope: getClientScope()!,
        })
        callSetIsPlaying(MEDIA_STATUS.PLAYING)
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

const createAudioElement = (context: AudioContext, destination: GainNode, track: Track) => {
    const audio = new Audio()
    audio.src = `${process.env.NEXT_PUBLIC_BACKEND}/music/${track!.path}`
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

const createWinampFx = createEffect<Track, any, any>((track) => {
    const _context = new (window.AudioContext || window.webkitAudioContext)()
    const _staticSource = _context.createGain()
    const _balance = StereoBalanceNode(_context) as GainNode & StereoBalanceNodeType

    initbalace(_balance.balance.value)

    const _preamp = _context.createGain()

    const _analyser = _context.createAnalyser()
    _analyser.fftSize = 2048
    _analyser.smoothingTimeConstant = 0.0
    const _gainNode = _context.createGain()

    const { _audio, _source } = createAudioElement(_context, _staticSource, track)

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

sample({
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
    clock: createWinampFx.doneData,
    fn: (media) => media,
    target: $Media,
})

const $winampState = createStore<TWinampState>(WINAMP_STATE.DESTROYED).on(
    initWinamp,
    () => WINAMP_STATE.INIT
)

const $visiblePlayer = createStore<boolean>(false)

const toggleShadePlayer = createEvent()

const $shadePlayer = createStore<boolean>(false).on(toggleShadePlayer, (state, _) => !state)

//function has load track in Media._audio
const loadUrl = createEvent<Track>()
const loadUrlFx = createEffect<[MediaElement, Track], Track, Error>(([media, track]) => {
    media._audio.src = `${process.env.NEXT_PUBLIC_BACKEND}/music/${track!.path}`
    return track
})
sample({
    clock: loadUrl,
    source: $Media,
    fn: (media, track) => [media, track] as [MediaElement, Track],
    target: loadUrlFx,
})

const setMediaStatus = createEvent<TMediaStatus>()
//@ts-ignore
//TODO:fix them
const $mediaStatus = createStore<TMediaStatus>(MEDIA_STATUS.STOPPED).on(
    setMediaStatus,
    (_, status) => status
)

const toggleLoop = createEvent()
const $loop = createStore<boolean>(false).on(toggleLoop, (state, _) => !state)

//toggle loop from ui
guard({
    clock: $loop,
    source: [$Media, $loop],
    filter: (params): params is [MediaElement, boolean] =>
        params[0]?._audio instanceof HTMLAudioElement,
    target: createEffect<[MediaElement, boolean], void>(([media, loop]) => {
        media._audio.loop = loop
    }),
})

const toggleShuffle = createEvent()
const $shuffle = createStore<boolean>(false).on(toggleShuffle, (state, _) => !state)

sample({
    clock: $shuffle,
    source: $Media,
    filter: (media, shuffled) => shuffled,
    fn: (media, shuffled) => media as MediaElement,
    target: createEffect<MediaElement, void>((media) => {
        media._audio.loop = false
    }),
})

const selectTrackFromList = createEvent<Track>()

sample({
    clock: selectTrackFromList,
    target: loadUrl,
})

$winampState.on(selectTrackFromList, () => WINAMP_STATE.TRACKLOADED)

sample({
    clock: selectTrackFromList,
    source: $winampState,
    filter: (state, _) => state === WINAMP_STATE.INIT,
    fn: () => WINAMP_STATE.TRACKLOADED,
    target: $winampState,
})

const $currentTrack = createStore<Nullable<Track>>(null).on(loadUrlFx.doneData, (_, track) => ({
    ...track,
}))

sample({
    clock: initWinamp,
    source: $currentTrack,
    filter: (track, _) => track !== null,
    fn: (track, _) => track!,
    target: createWinampFx,
})

const {
    toggleTimeMode,
    setDuration,
    setCurrentTime,
    seekingCurrentTime,
    onmouseup,
    onmousedown,
    keyChangeCurrentTime,
    $timer,
    $timeMode,
    $seekingProgress,
    $currentTrackTimeRemaining,
    $currentTrackDuration,
    $currentTime,
    $allowSeeking,
} = createWinampProgressFactory($Media, $currentTrack)

const { setVolume, changeVolume, $volume, setVolumeFromKeys } = createWinampVolumeFactory($Media)
const {
    toggleVisibleEQ,
    toggleAutoEQ,
    enableClickedEQ,
    toggleMinimizeEQ,
    resetEqBand,
    disableClickedEQ,
    changePreampValue,
    changeEQBand,
    changeAllBandsValues,
    $visibleEQ,
    $preamp,
    $minimizedEQ,
    $enabledEQ,
    $bands,
    $autoEQ,
    loadPreset,
    $presets,
    $currentPreset,
    $selectedPreset,
    $visiblePresetWindow,
    selectPreset,
    toggleVisiblePresetWindow,
} = createWinampEQFactory($Media)

const {
    $playlist,
    addTrackToPlaylist,
    $playlistLength,
    $selectedTrackInPlaylist,
    selectTrackInPlaylist,
    doubleClickedTrackInPlaylist,
    $currentPlayedTrackIndex,
    setCurrentPlayedTrackIndex,
    $durationTracksInPlaylist,
    $visiblePlaylist,
    toggleVisiblePlaylist,
} = createWinampPlaylistFactory()

const { setBalance, changeBalance, $currentBalance } = createWinampBalanceFactory($Media)

const initbalace = (value: number) => {
    const callSetBalance = scopeBind(setBalance, { scope: getClientScope()! })
    callSetBalance(value * 100)
}

const removeTrackFromPlaylist = createEvent<number>()

$playlist
    .on(selectTrackFromList, (_, track) => [track])
    .on(removeTrackFromPlaylist, (tracks, id) => tracks.filter((track, index) => index !== id))

$selectedTrackInPlaylist.reset(removeTrackFromPlaylist)

$currentPlayedTrackIndex.on(selectTrackFromList, () => 0)

sample({
    clock: removeTrackFromPlaylist,
    source: $currentPlayedTrackIndex,
    filter: (currentIndex, removedIndex) => {
        if (currentIndex === removedIndex) return false
        if (currentIndex !== null) {
            if (currentIndex > removedIndex) return true
        }
        return false
    },
    fn: (currentIndex, _) => currentIndex! - 1,
    target: $currentPlayedTrackIndex,
})

sample({
    clock: $currentPlayedTrackIndex,
    source: $playlist,
    filter: (playlist, id) => id !== null,
    fn: (playlist, id) => playlist[id!],
    target: $currentTrack,
})

//when track ended check next track in playlist exists
const playNextTrack = createEvent()
// checking playlist is emtpy state

const checkPlayNextTrack = guard({
    clock: playNextTrack,
    source: $playlistLength,
    filter: (playlistLength, _) => playlistLength > 0,
})

const checkPlayNextTrackNoShuffle = guard({
    clock: checkPlayNextTrack,
    source: $shuffle,
    filter: (shuffle, _) => !shuffle,
})

//when playlist is not empty check currentTrackIndex in playlist if not last put next, otherwise put first
const playNextTrackNoShuffle = sample({
    clock: checkPlayNextTrackNoShuffle,
    source: [$currentPlayedTrackIndex, $playlistLength],

    fn: ([currentIndex, playListLength], _) => {
        const lastTrack = currentIndex === playListLength! - 1
        if (lastTrack) return 0
        return currentIndex! + 1
    },
})

//set new Track index in currentPlayedTrackIndexPlaylist
sample({
    clock: playNextTrackNoShuffle,
    fn: (newTrackIndex) => newTrackIndex,
    target: $currentPlayedTrackIndex,
})

// when Shuffle is ON
const checkPlayNextTrackShuffled = guard({
    clock: checkPlayNextTrack,
    source: $shuffle,
    filter: (shuffle, _) => shuffle,
})

const isOneTrackInPlayList = guard({
    clock: checkPlayNextTrackShuffled,
    source: $playlistLength,
    filter: (playListLength, _) => playListLength === 1,
})
const isBiggerOneTrackInPlayList = guard({
    clock: checkPlayNextTrackShuffled,
    source: $playlistLength,
    filter: (playListLength, _) => playListLength > 1,
})

sample({
    clock: isOneTrackInPlayList,
    source: $Media,
    fn: (media, _) => media!._audio as HTMLAudioElement,
    target: createEffect<HTMLAudioElement, void>((_audio) => {
        _audio.currentTime = 0
        _audio.play()
    }),
})

sample({
    clock: isBiggerOneTrackInPlayList,
    source: [$playlistLength, $currentPlayedTrackIndex],
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
    target: $currentPlayedTrackIndex,
})

//setting new Track in CurrentTrack
sample({
    clock: $currentPlayedTrackIndex,
    source: $playlist,
    fn: (playlist, newTrackIndex) => playlist[newTrackIndex!],
    target: loadUrl,
})

//Controls

const onPlayClicked = createEvent()
//when press playbutton when status playing
sample({
    clock: onPlayClicked,
    source: [$Media, $mediaStatus],
    filter: ([media, status], _) => status === MEDIA_STATUS.PLAYING,
    fn: ([media, status], _) => media as MediaElement,
    target: startPlayFromBegginingFx,
})

//when press playbutton and status not playing
sample({
    clock: onPlayClicked,
    source: [$Media, $mediaStatus],
    filter: ([media, status], _) => status !== MEDIA_STATUS.PLAYING,
    fn: ([media, status], _) => media as MediaElement,
    target: startPlayingFx,
})

const onPauseClicked = createEvent()

sample({
    clock: onPauseClicked,
    source: $Media,
    filter: (Media): Media is MediaElement => Media?._audio instanceof HTMLAudioElement,
    fn: (Media) => Media as MediaElement,
    target: pausePlayingFx,
})

const onStopButtonClicked = createEvent()

sample({
    clock: onStopButtonClicked,
    source: $Media,
    fn: (media, _) => media as MediaElement,
    target: stopPlayingFx,
})

sample({
    clock: stopPlayingFx.done,
    fn: () => MEDIA_STATUS.STOPPED,
    target: $mediaStatus,
})

// const delayedStopButtonClicked = delay({
//     source: onStopButtonClicked,
//     timeout: 300,
//     target: $mediaStatus,
// })

sample({
    clock: doubleClickedTrackInPlaylist,
    fn: () => MEDIA_STATUS.STOPPED,
    target: $mediaStatus,
})

sample({
    clock: doubleClickedTrackInPlaylist,
    source: $Media,
    fn: (media, event) => media as MediaElement,
    target: startPlayingFx,
})

const nextTrackClicked = createEvent()

forward({
    from: nextTrackClicked,
    to: playNextTrack,
})

const prevTrackClicked = createEvent()
const checkPrevTrackClicked = guard({
    clock: prevTrackClicked,
    source: $playlistLength,
    filter: (playListLength, _) => playListLength > 0,
})

const playPrevTrackNoShuffle = guard({
    clock: checkPrevTrackClicked,
    source: $shuffle,
    filter: (shuffle, _) => !shuffle,
})

sample({
    clock: playPrevTrackNoShuffle,
    source: [$playlist, $currentPlayedTrackIndex],
    fn: ([playList, currentTrackId], _) => {
        // @ts-ignore: types error
        if (currentTrackId === 0) return playList.length - 1
        // @ts-ignore: types error
        return currentTrackId - 1
    },
    target: setCurrentPlayedTrackIndex,
})

const checkPlayPrevTrackShuffled = guard({
    clock: checkPrevTrackClicked,
    source: $shuffle,
    filter: (shuffle, _) => shuffle,
})

sample({
    clock: checkPlayPrevTrackShuffled,
    source: [$playlistLength, $currentPlayedTrackIndex],
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
    target: setCurrentPlayedTrackIndex,
})

//balance Control

/** ------------work with window winamp---------- */

//closing Winamp

sample({
    clock: closeWinamp,
    target: onStopButtonClicked,
})

sample({
    clock: closeWinamp,
    fn: () => WINAMP_STATE.CLOSED,
    target: $winampState,
})

sample({
    clock: $winampState,
    filter: (state) =>
        state === WINAMP_STATE.CLOSED ||
        state === WINAMP_STATE.MINIMIZED ||
        state === WINAMP_STATE.DESTROYED,
    fn: () => false,
    target: [$visibleEQ, $visiblePlayer, $visiblePlaylist],
})

sample({
    clock: $winampState,
    filter: (state) => state === WINAMP_STATE.OPENED || state === WINAMP_STATE.TRACKLOADED,
    fn: () => true,
    target: [$visibleEQ, $visiblePlayer, $visiblePlaylist],
})

const minimizedWinamp = createEvent()

sample({
    clock: minimizedWinamp,
    fn: () => WINAMP_STATE.MINIMIZED,
    target: $winampState,
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
    target: $playlist,
})

sample({
    clock: playAllTracksFromList,
    fn: () => 0,
    target: $currentPlayedTrackIndex,
})

sample({
    clock: playAllTracksFromList,
    target: showWinamp,
})

sample({
    clock: playAllTracksFromList,
    source: $mediaStatus,
    filter: (state, _) => state !== MEDIA_STATUS.PLAYING,
    target: onPlayClicked,
})

const changeClutterBar = createEvent<string>()
const $clutterBar = createStore<Record<string, boolean>>({
    o: false,
    a: false,
    i: false,
    d: false,
    v: false,
}).on(changeClutterBar, (state, name) => {
    const currrentName = state[name]
    return { ...state, [name]: !currrentName }
})

const toggleEnabledMarqueInfo = createEvent()
const enabledMarqueInfo = createEvent()
const disabledMarqueInfo = createEvent()

const $enabledMaruqeInfo = createStore<boolean>(false)
    .on(toggleEnabledMarqueInfo, (state, _) => !state)
    .on(enabledMarqueInfo, () => true)
    .on(disabledMarqueInfo, () => false)

const setMarqueInfo = createEvent<string | number>()

const $winampMarqueInfo = createStore<Nullable<string>>("")
    .on(setMarqueInfo, (_, payload) => String(payload))
    .reset([disabledMarqueInfo, $enabledMaruqeInfo])
    .on($currentBalance, (_, balance) => {
        if (balance < -5) return `Balance: ${balance * -1}% left`
        if (balance > 5) return `Balance: ${balance}% right`
        return "Balance: center"
    })
    .on($volume, (_, volume) => `Volume: ${Math.floor(volume)}%`)

//show in TrackListInfo seeking progress
sample({
    clock: $seekingProgress,
    source: $currentTrackDuration,
    fn: (duration, seekingValue) => {
        const percent = Math.floor((seekingValue / duration) * 100)

        const currentTime = convertTimeToString(seekingValue)
        const currentDuration = convertTimeToString(duration)

        return `Seek To: ${currentTime}/${currentDuration} (${percent}%)`
    },

    target: setMarqueInfo,
})

sample({
    clock: changeEQBand,
    fn: (val) => {
        const snapBandValue = _snapBandValue(Number(val.target.value))
        const db = (snapBandValue / 100) * 24 - 12
        return `EQ: ${val.target.name}HZ ${db.toFixed(1)} DB`
    },
    target: setMarqueInfo,
})

sample({
    clock: changePreampValue,
    fn: (val) => {
        const snapBandValue = _snapBandValue(Number(val.target.value))
        const db = (snapBandValue / 100) * 24 - 12
        return `EQ: PREAMP ${db.toFixed(1)} DB`
    },
    target: setMarqueInfo,
})

export const marqueInfo = {
    $winampMarqueInfo,
    $enabledMaruqeInfo,
    enabledMarqueInfo,
    disabledMarqueInfo,
    toggleEnabledMarqueInfo,
}

export const balance = {
    $currentBalance,
    changeBalance,
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
    doubleClick: doubleClickedTrackInPlaylist,
    $playlistLength,
    $playlist,
    $selectedTrackInPlayList: $selectedTrackInPlaylist,
    selectTrackInPlaylist,
    $currentPlayedTrackIndex,
    addTrackToPlaylist,
    $visiblePlaylist,
    toggleVisiblePlaylist,
    removeTrackFromPlaylist,
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
    changeVolume,
    setVolumeFromKeys,
}

export const duration = {
    $durationTracksInPlaylist,
    $currentTrackDuration,
}

export const winamp = {
    init: initWinamp,
    destroy: destroyWinamp,
    close: closeWinamp,
    show: showWinamp,
    minimize: minimizedWinamp,

    $mediaStatus,
    $currentTrack,
    selectTrackFromList,
    playAllTracksFromList,
    $timeMode,
    toggleTimeMode,
    toggleShadePlayer,
    $loop,
    $shuffle,
}

export const winampStates = {
    $winampState,

    $activeWindow,
    changeWindowState,
    $visiblePlayer,
    $shadePlayer,
}

export const eq = {
    changeAllBandsValues,
    changePreampValue,
    changeEQBand,
    disableClickedEQ,
    enableClickedEQ,
    resetEqBand,
    $auto: $autoEQ,
    $enabled: $enabledEQ,
    $preamp,
    $bands,
    $visibleEQ,
    toggleVisibleEQ,
    toggleAutoEQ,
    $presets,
    loadPreset,
    $currentPreset,
    $selectedPreset,
    $visiblePresetWindow,
    selectPreset,
    toggleVisiblePresetWindow,
    $minimized: $minimizedEQ,
    toggleMinimized: toggleMinimizeEQ,
}

export const $baseSkinColors = createStore<string[]>(baseSkinColors)

export { loadUrl, selectTrackFromList, $Media, $clutterBar, changeClutterBar }

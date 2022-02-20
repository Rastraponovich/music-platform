import { getClientScope } from "@/hooks/useScope"
import { Nullable } from "@/types"
import { createEffect, createEvent, createStore, guard, sample, scopeBind, Store } from "effector"
import { ChangeEvent, MouseEvent } from "react"
import { Band, MediaElement, TIME_MODE, Track, _BANDS } from "./types"

const createWinampVolumeFactory = ($Media: Store<Nullable<MediaElement>>) => {
    //change volume from UI
    const changeVolume = createEvent<ChangeEvent<HTMLInputElement>>()

    const setVolume = createEvent<number>()
    const $volume = createStore<number>(50).on(setVolume, (_, volume) => volume)

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

    return {
        $volume,

        setVolume,
        resetVolume,
        changeVolume,
    }
}

const createWinampPlaylistFactory = () => {
    const addTrackToPlaylist = createEvent<Track>()
    const $playlist = createStore<Track[]>([]).on(addTrackToPlaylist, (tracks, track) => [
        ...tracks,
        track,
    ])

    const $playlistLength = $playlist.map((state) => state.length)

    const selectTrackInPlaylist = createEvent<number>()
    const $selectedTrackInPlaylist = createStore<Nullable<number>>(null).on(
        selectTrackInPlaylist,
        (_, trackIndex) => trackIndex
    )

    const doubleClickedTrackInPlaylist = createEvent<number>()

    const setCurrentPlayedTrackIndex = createEvent<number>()

    const $currentPlayedTrackIndex = createStore<Nullable<number>>(null)
        .on(doubleClickedTrackInPlaylist, (_, id) => id)
        .on(setCurrentPlayedTrackIndex, (_, id) => id)

    const $durationTracksInPlaylist = createStore<number>(0).on($playlist, (_, tracks) => {
        let initDuration = 0
        const currentDuration = tracks.reduce(
            (acc, current) => acc + current.metaData.format.duration,
            initDuration
        )
        return currentDuration
    })

    const toggleVisiblePlaylist = createEvent()
    const $visiblePlaylist = createStore<boolean>(false).on(
        toggleVisiblePlaylist,
        (state, _) => !state
    )

    return {
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
    }
}

const createWinampProgressFactory = (
    $Media: Store<Nullable<MediaElement>>,
    $currentTrack: Store<Nullable<Track>>
) => {
    const changeCurrentTimeFx = createEffect<[HTMLAudioElement, number, boolean], void>(
        ([audio, newcurrentTime, allowSeeking]) => {
            if (allowSeeking) {
                audio.currentTime = newcurrentTime
            }
        }
    )

    const keyChangeCurrentTimeFx = createEffect<[HTMLAudioElement, string, boolean], void>(
        ([audio, event, allowSeeking]) => {
            if (event === "forward") {
                audio.currentTime = audio.currentTime + 5
            }
            if (event === "backward") {
                audio.currentTime = audio.currentTime - 5
            }
        }
    )

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
    // set current time form ui
    const setCurrentTime = createEvent<number>()

    //set current time from emitter
    const changeCurrentTime = createEvent<number>()
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
        target: changeCurrentTimeFx,
    })

    //changing time in keypress
    const keyChangeCurrentTime = createEvent<string>()

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
        target: keyChangeCurrentTimeFx,
    })

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
    }).reset($currentTrack)

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

    return {
        $timer,
        $timeMode,
        $currentTime,
        $allowSeeking,
        $seekingProgress,
        $currentTrackDuration,
        $currentTrackTimeRemaining,
        onmouseup,
        onmousedown,
        setDuration,
        toggleTimeMode,

        setCurrentTime,
        changeCurrentTime,
        seekingCurrentTime,
        changeCurrentTimeFx,
        keyChangeCurrentTime,
        keyChangeCurrentTimeFx,
    }
}

const createWinampBalanceFactory = ($Media: Store<Nullable<MediaElement>>) => {
    const changeBalanceFx = createEffect<
        [Nullable<MediaElement>, ChangeEvent<HTMLInputElement>],
        void
    >(([media, event]) => {
        const value = Number(event.target.value)
        media!._balance.balance.value = value / 100
        const callSetBalanceScoped = scopeBind(setBalance, { scope: getClientScope()! })
        callSetBalanceScoped(value)
    })

    const resetBalanceFx = createEffect<Nullable<MediaElement>, void>((media) => {
        media!._balance.balance.value = 0
        const callSetBalanceScoped = scopeBind(setBalance, { scope: getClientScope()! })
        callSetBalanceScoped(0)
    })

    const setBalance = createEvent<number>()
    const changeBalance = createEvent<ChangeEvent<HTMLInputElement>>()
    const resetBalance = createEvent()
    const $currentBalance = createStore<number>(0).on(setBalance, (_, newBalance) => newBalance)
    //change balance from ui
    sample({
        clock: changeBalance,
        source: $Media,
        fn: (media, event) =>
            [media, event] as [Nullable<MediaElement>, ChangeEvent<HTMLInputElement>],

        target: changeBalanceFx,
    })

    sample({
        clock: resetBalance,
        source: $Media,
        fn: (Media, _) => Media,
        target: resetBalanceFx,
    })

    return {
        $currentBalance,
        setBalance,
        resetBalance,
        changeBalance,
    }
}

enum ChangeAllBandsEvent {
    min = "min",
    max = "max",
    reset = "reset",
}
const CHANGE_ALL_BANDS_EVENT: Record<string, number> = {
    min: 0,
    max: 100,
    reset: 50,
}

const BAND_MID_POINT_VALUE = 50
const BAND_SNAP_DISTANCE = 5

const _snapBandValue = (value: number): number => {
    if (
        value < BAND_MID_POINT_VALUE + BAND_SNAP_DISTANCE &&
        value > BAND_MID_POINT_VALUE - BAND_SNAP_DISTANCE
    ) {
        return BAND_MID_POINT_VALUE
    }
    return value
}

const createWinampEQFactory = ($Media: Store<Nullable<MediaElement>>) => {
    const enableEQFx = createEffect<MediaElement, void>((media) => {
        media._staticSource.disconnect()
        media._staticSource.connect(media._preamp)

        const callEnabledEQScoped = scopeBind(toggleEnabledEQ, { scope: getClientScope()! })
        callEnabledEQScoped()
    })

    const disableEQFx = createEffect<MediaElement, void>((media) => {
        media._staticSource.disconnect()
        media._staticSource.connect(media._balance)
        const callEnabledEQScoped = scopeBind(toggleEnabledEQ, { scope: getClientScope()! })
        callEnabledEQScoped()
    })

    const resetEqBandFx = createEffect<[MediaElement, string], void>(([media, name]) => {
        const bandName = Number(name) as keyof _BANDS
        media._bands[bandName].gain.value = 0
        const callResetBandScoped = scopeBind(setBand, { scope: getClientScope()! })
        callResetBandScoped({ [bandName]: 50 } as Record<Band, number>)
    })

    const setEQbandFx = createEffect<[MediaElement, ChangeEvent<HTMLInputElement>], void>(
        ([media, { target }]) => {
            const { value, name } = target

            const snapBandValue = _snapBandValue(Number(value))

            const bandName = Number(name) as keyof _BANDS
            const db = (snapBandValue / 100) * 24 - 12
            media!._bands[bandName].gain.value = db
            const callSetBandScoped = scopeBind(setBand, { scope: getClientScope()! })
            callSetBandScoped({ [bandName]: snapBandValue } as Record<Band, number>)
        }
    )

    const changePreampValueFx = createEffect<[MediaElement, ChangeEvent<HTMLInputElement>], void>(
        ([media, event]) => {
            const value = _snapBandValue(Number(event.target.value))

            const db = (value / 100) * 24 - 12
            media._preamp.gain.value = Math.pow(10, db / 20)

            const callChangePreampScoped = scopeBind(setPreamp, { scope: getClientScope()! })
            callChangePreampScoped(value)
        }
    )

    const setAllBandsEqFx = createEffect<[MediaElement, string], void>(([media, event]) => {
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
        const callChangeAllBandsScoped = scopeBind(changeAllBands, { scope: getClientScope()! })
        callChangeAllBandsScoped(event)
    })

    //turn off EQ in UI
    const disableClickedEQ = createEvent()

    sample({
        clock: disableClickedEQ,
        source: $Media,
        filter: (media, _): media is MediaElement => media?._audio instanceof HTMLAudioElement,
        target: disableEQFx,
    })

    // turn on EQ in UI
    const enableClickedEQ = createEvent()
    sample({
        clock: enableClickedEQ,
        source: $Media,
        filter: (media, _): media is MediaElement => media?._audio instanceof HTMLAudioElement,
        target: enableEQFx,
    })

    //ui change EQ Band
    const changeEQBand = createEvent<ChangeEvent<HTMLInputElement>>()
    sample({
        clock: changeEQBand,
        source: $Media,
        fn: (media, event) => [media, event] as [MediaElement, ChangeEvent<HTMLInputElement>],
        target: setEQbandFx,
    })

    //ui doubleclick in eqband
    const resetEqBand = createEvent<string>()
    sample({
        clock: resetEqBand,
        source: $Media,
        fn: (media, name) => [media, name] as [MediaElement, string],
        target: resetEqBandFx,
    })

    //set MAX/MIN/RESET all BANDS in UI
    const changeAllBandsValues = createEvent<string>()
    sample({
        clock: changeAllBandsValues,
        source: $Media,
        fn: (media, event) => [media, event] as [MediaElement, string],
        target: setAllBandsEqFx,
    })
    //ui change preamp slider value
    const changePreampValue = createEvent<ChangeEvent<HTMLInputElement>>()
    sample({
        clock: changePreampValue,
        source: $Media,
        fn: (media, event) => [media, event] as [MediaElement, ChangeEvent<HTMLInputElement>],
        target: changePreampValueFx,
    })

    const toggleVisibleEQ = createEvent()
    const $visibleEQ = createStore<boolean>(false).on(toggleVisibleEQ, (state, _) => !state)

    const toggleMinimizeEQ = createEvent()
    const $minimizedEQ = createStore<boolean>(false).on(toggleMinimizeEQ, (state, _) => !state)

    const toggleEnabledEQ = createEvent()

    const $enabledEQ = createStore<boolean>(true).on(toggleEnabledEQ, (state, _) => !state)

    const toggleAutoEQ = createEvent()
    const $autoEQ = createStore<boolean>(false).on(toggleAutoEQ, (state, _) => !state)

    const setBand = createEvent<Record<Band, number>>()
    const resetAllBands = createEvent()

    const changeAllBands = createEvent<string>()

    const $bands = createStore<Record<Band, number>>({
        "60": 50,
        "170": 50,
        "310": 50,
        "600": 50,
        "1000": 50,
        "3000": 50,
        "6000": 50,
        "12000": 50,
        "14000": 50,
        "16000": 50,
    })
        .on(setBand, (bands, band) => ({ ...bands, ...band }))
        .reset(resetAllBands)
        .on(changeAllBands, (state, event) => {
            let newValue = 0
            switch (event) {
                case ChangeAllBandsEvent.min:
                    newValue = CHANGE_ALL_BANDS_EVENT[event]
                    break
                case ChangeAllBandsEvent.max:
                    newValue = CHANGE_ALL_BANDS_EVENT[event]
                    break
                case ChangeAllBandsEvent.reset:
                    newValue = CHANGE_ALL_BANDS_EVENT[event]
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

    const resetPreamp = createEvent()

    const setPreamp = createEvent<number>()

    const $preamp = createStore<number>(50)
        .on(setPreamp, (_, value) => value)
        .reset(resetPreamp)

    return {
        $bands,
        $autoEQ,
        $preamp,
        $enabledEQ,
        $visibleEQ,
        $minimizedEQ,

        resetEqBand,
        toggleAutoEQ,
        changeEQBand,
        enableClickedEQ,
        toggleVisibleEQ,
        disableClickedEQ,
        toggleMinimizeEQ,
        changePreampValue,
        changeAllBandsValues,
    }
}
export {
    createWinampVolumeFactory,
    createWinampPlaylistFactory,
    createWinampProgressFactory,
    createWinampBalanceFactory,
    createWinampEQFactory,
}

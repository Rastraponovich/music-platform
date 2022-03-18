import { Nullable } from "@/types"
import { Store, createEffect, createEvent, createStore, sample, guard } from "effector"
import { ChangeEvent, MouseEvent } from "react"
import { MediaElement, Track, TIME_MODE } from "./types"

export const createWinampProgressFactory = (
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
        clock: [$currentTime, $timeMode],
        source: [$currentTime, $timeMode],
        filter: ([currentTime, timeMode]: [number, TIME_MODE], _: any) =>
            timeMode === TIME_MODE.ELAPSED,
        target: convertCurrentTimeToTimerFx,
    })

    guard({
        clock: [$currentTrackTimeRemaining, $timeMode],
        source: [$currentTrackTimeRemaining, $timeMode],
        filter: ([currentTime, timeMode]: [number, TIME_MODE], _: any) =>
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

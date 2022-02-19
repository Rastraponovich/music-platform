import { Nullable } from "@/types"
import { createEffect, createEvent, createStore, guard, sample, Store } from "effector"
import { ChangeEvent } from "react"
import { MediaElement } from "./types"

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

export { createWinampVolumeFactory }

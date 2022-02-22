import { Nullable } from "@/types"
import { createEffect, createEvent, createStore, guard, sample, Store } from "effector"
import { ChangeEvent } from "react"
import { MediaElement, _BANDS } from "./types"

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

    return {
        $volume,
        setVolume,
        changeVolume,
    }
}

export { createWinampVolumeFactory }

import { Nullable } from "@/types"
import { createEffect, createEvent, createStore, sample, scopeBind, Store } from "effector"
import { debug } from "patronum"
import { ChangeEvent } from "react"
import { Band, MediaElement, _BANDS } from "./types"

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

export const createEQFactory = ($Media: Store<Nullable<MediaElement>>) => {
    const enableEQFx = createEffect<MediaElement, void>((media) => {
        media._staticSource.disconnect()
        media._staticSource.connect(media._preamp)

        const callEnabledEQScoped = scopeBind(toggleEnabledEQ)
        callEnabledEQScoped()
    })

    const disableEQFx = createEffect<MediaElement, void>((media) => {
        media._staticSource.disconnect()
        media._staticSource.connect(media._balance)
        const callEnabledEQScoped = scopeBind(toggleEnabledEQ)
        callEnabledEQScoped()
    })

    const resetEqBandFx = createEffect<[MediaElement, string], void>(([media, name]) => {
        const bandName = Number(name) as keyof _BANDS
        media._bands[bandName].gain.value = 0
        const callResetBandScoped = scopeBind(setBand)
        callResetBandScoped({ [bandName]: 50 } as Record<Band, number>)
    })

    const setEQbandFx = createEffect<[MediaElement, ChangeEvent<HTMLInputElement>], void>(
        ([media, { target }]) => {
            const { value, name } = target

            const snapBandValue = _snapBandValue(Number(value))

            const bandName = Number(name) as keyof _BANDS
            const db = (snapBandValue / 100) * 24 - 12
            media!._bands[bandName].gain.value = db
            const callSetBandScoped = scopeBind(setBand)
            callSetBandScoped({ [bandName]: snapBandValue } as Record<Band, number>)
        }
    )

    const changePreampValueFx = createEffect<[MediaElement, ChangeEvent<HTMLInputElement>], void>(
        ([media, event]) => {
            const value = _snapBandValue(Number(event.target.value))

            const db = (value / 100) * 24 - 12
            media._preamp.gain.value = Math.pow(10, db / 20)

            const callChangePreampScoped = scopeBind(setPreamp)
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
        const callChangeAllBandsScoped = scopeBind(changeAllBands)
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

    debug(setBand, $bands)

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

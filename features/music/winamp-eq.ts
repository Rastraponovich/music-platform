import { getClientScope } from "@/hooks/useScope"
import { Nullable } from "@/types"
import { _snapBandValue } from "@/utils/utils"
import { Store, createEffect, scopeBind, createEvent, sample, createStore } from "effector"
import { debug } from "patronum"
import { ChangeEvent } from "react"
import { PRESETS, PRESETS_ARRAY } from "./constants"
import { MediaElement, _BANDS, Band, PRESETS_TYPE, PRESET } from "./types"

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

const calculateGainValueBandEQ = (value: number) => {
    const db = (value / 100) * 24 - 12
    const gainValue = Math.pow(10, db / 20)

    return gainValue
}

// const calculatePercentFromBandEQ = (gain:number = 4.8) => {
//     gain = (value / 100) * 24 - 12
//     const gainValue = Math.pow(10, db / 20)

//     return gainValue
// }

export const createWinampEQFactory = ($Media: Store<Nullable<MediaElement>>) => {
    const loadPresetFx = createEffect<[MediaElement, PRESET], void>(([media, preset]) => {
        const callSetBandScoped = scopeBind(setBand, { scope: getClientScope()! })

        Object.entries(preset.value).forEach(([key, value]) => {
            const bandName = Number(key) as keyof _BANDS
            const db = (value / 100) * 24 - 12
            media!._bands[bandName].gain.value = db

            callSetBandScoped({ [bandName]: value } as Record<Band, number>)
        })
    })

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

            console.log(db, value)

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

    const $bands = createStore<Record<Band, number>>(PRESETS.DEFAULT.value)
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

    const loadPreset = createEvent()

    const $currentPreset = createStore<PRESET>(PRESETS.DEFAULT)

    sample({
        clock: $currentPreset,
        source: $Media,
        fn: (media, preset) => [media, preset] as [MediaElement, PRESET],
        target: loadPresetFx,
    })

    const $presets = createStore<PRESET[]>(PRESETS_ARRAY)

    const toggleVisiblePresetWindow = createEvent()
    const $visiblePresetWindow = createStore<boolean>(false)
        .on(toggleVisiblePresetWindow, (state, _) => !state)
        .reset($currentPreset)

    const selectPreset = createEvent<PRESET>()
    const $selectedPreset = createStore<Nullable<PRESET>>(null)
        .on(selectPreset, (_, preset) => preset)
        .reset($currentPreset)

    sample({
        clock: loadPreset,
        source: $selectedPreset,
        fn: (preset, _) => preset!,
        filter: (preset, _) => preset !== null,
        target: $currentPreset,
    })

    debug(loadPreset, $selectedPreset, selectPreset)

    return {
        $bands,
        $autoEQ,
        $preamp,
        $presets,
        $enabledEQ,
        $visibleEQ,
        $minimizedEQ,
        $currentPreset,
        loadPreset,
        resetEqBand,
        toggleAutoEQ,
        changeEQBand,
        enableClickedEQ,
        toggleVisibleEQ,
        disableClickedEQ,
        toggleMinimizeEQ,
        changePreampValue,
        changeAllBandsValues,
        selectPreset,
        $selectedPreset,
        toggleVisiblePresetWindow,
        $visiblePresetWindow,
    }
}

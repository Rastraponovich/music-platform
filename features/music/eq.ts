import { createEvent, createStore } from "effector"
import { ChangeEvent } from "react"
import { Band } from "./types"

const destroyEQ = createEvent<void>()
const toggleVisibleEQ = createEvent()
const $visibleEQ = createStore<boolean>(false)
    .on(toggleVisibleEQ, (state, _) => !state)
    .on(destroyEQ, () => false)
// .on(player.$playerState, (_, state) => state === EPLAYER_STATE.DESTROYED && false) // not work

const toggleMinimizeEQ = createEvent()
const $minimizedEQ = createStore<boolean>(false).on(toggleMinimizeEQ, (state, _) => !state)

const toggleEnabledEQ = createEvent()
const $enabledEQ = createStore<boolean>(true).on(toggleEnabledEQ, (state, _) => !state)

const toggleAutoEQ = createEvent()
const $autoEQ = createStore<boolean>(false).on(toggleAutoEQ, (state, _) => !state)

const resetPreamp = createEvent()
const changePreamp = createEvent<ChangeEvent<HTMLInputElement>>()
const $preamp = createStore<number>(50)
    .on(changePreamp, (_, event) => Number(event.target.value))
    .reset(resetPreamp)

const resetFrequency = createEvent<string>()
const $frequency = createStore<Record<Band, number>>({
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
}).on(resetFrequency, (state, id) => ({ ...state, [id]: 50 }))

export {
    destroyEQ,
    $visibleEQ,
    toggleVisibleEQ,
    toggleEnabledEQ,
    toggleAutoEQ,
    $autoEQ,
    $enabledEQ,
    $frequency,
    resetFrequency,
    $preamp,
    changePreamp,
    resetPreamp,
    toggleMinimizeEQ,
    $minimizedEQ,
}

export const createEQFactory = () => {
    const destroyEQ = createEvent<void>()
    const toggleVisibleEQ = createEvent()
    const $visibleEQ = createStore<boolean>(false)
        .on(toggleVisibleEQ, (state, _) => !state)
        .on(destroyEQ, () => false)

    const toggleMinimizeEQ = createEvent()
    const $minimizedEQ = createStore<boolean>(false).on(toggleMinimizeEQ, (state, _) => !state)

    const toggleEnabledEQ = createEvent()
    const $enabledEQ = createStore<boolean>(false).on(toggleEnabledEQ, (state, _) => !state)

    const toggleAutoEQ = createEvent()
    const $autoEQ = createStore<boolean>(false).on(toggleAutoEQ, (state, _) => !state)

    const changePreamp = createEvent<ChangeEvent<HTMLInputElement>>()
    const $preamp = createStore<number>(0).on(changePreamp, (_, event) =>
        Number(event.target.value)
    )

    const changeFrequency = createEvent<ChangeEvent<HTMLInputElement>>()
    const $frequency = createStore<{ [key: string]: number }>({
        "60": 50,
        "170": 50,
        "310": 50,
        "600": 50,
        "1K": 50,
        "3k": 50,
        "6k": 50,
        "12k": 50,
        "14k": 50,
        "16k": 50,
    }).on(changeFrequency, (state, event) => ({
        ...state,
        [event.target.name]: Number(event.target.value),
    }))

    return {
        destroyEQ,
        $visibleEQ,
        toggleVisibleEQ,
        toggleEnabledEQ,
        toggleAutoEQ,
        $autoEQ,
        $enabledEQ,
        $frequency,
        changeFrequency,
        $preamp,
        changePreamp,
        toggleMinimizeEQ,
        $minimizedEQ,
    }
}

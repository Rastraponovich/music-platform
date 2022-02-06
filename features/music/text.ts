import { createEffect, createEvent, createStore, forward, sample, scopeBind } from "effector"
import { createGate } from "effector-react"

let audio: HTMLAudioElement

export const testGate = createGate<string>()

const onSetAudio = createEvent<string>()

const onPlay = createEvent()

const onTimeUpdate = createEvent<number>()
const onChangeCurrentTime = createEvent<number>()
const $currentTime = createStore<number>(0).on(onTimeUpdate, (_, payload) => payload)

const onSetAudioFx = createEffect<string, any, any>()

forward({ from: onSetAudio, to: onSetAudioFx })

onSetAudioFx.use((payload: string) => {
    audio = new Audio()

    audio.src = payload
    const scoped = scopeBind(onTimeUpdate)

    audio.ontimeupdate = () => scoped(audio.currentTime)
})

sample({
    clock: testGate.open,

    fn: (props) => props,

    target: onSetAudio,
})

sample({
    clock: onPlay,

    fn: () => {
        audio.play()
    },
})

sample({
    clock: onChangeCurrentTime,

    fn: (time) => (audio.currentTime = time),
})
//http://localhost:4000/music/7f2ddd70-73a5-45a2-83af-1cd3d93c9bf4.mp3
export { onSetAudio, audio, onPlay, $currentTime, onChangeCurrentTime }

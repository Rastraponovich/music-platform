import { volume } from "@/features/media/winamp"
import { createStore } from "effector"
import { VOLUME_STEP } from "../lib"

export const $currentVolume = createStore(100).on(volume.$volume, (_, volume) => volume)
export const $currentVolumeStep = createStore<number>(100)

$currentVolumeStep.on(volume.$volume, (_, currentVolume) => {
    return Math.floor(currentVolume / VOLUME_STEP)
})

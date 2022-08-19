import { useStore } from "effector-react"
import { $currentVolume, $currentVolumeStep } from "./model"

export const useCurrentVolume = () => useStore($currentVolume)
export const useCurrentVolumeStep = () => useStore($currentVolumeStep)

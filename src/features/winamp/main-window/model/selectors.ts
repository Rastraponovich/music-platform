import { useStore } from "effector-react"
import { $currentBalance, $currentBalanceStep } from "./balance-bar"
import { $currentVolume, $currentVolumeStep } from "./volume-bar"

export const useCurrentBalance = () => useStore($currentBalance)
export const currentBalanceStep = () => useStore($currentBalanceStep)

export const useCurrentVolume = () => useStore($currentVolume)
export const useCurrentVolumeStep = () => useStore($currentVolumeStep)

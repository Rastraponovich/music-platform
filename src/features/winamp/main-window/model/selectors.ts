import { $clutterBar, progress, winamp } from "@/features/media/winamp"
import type { TIME_MODE, TMediaStatus } from "@/features/music/types"

import { useStore } from "effector-react"
import { $currentBalance, $currentBalanceStep } from "./balance-bar"
import { $currentVolume, $currentVolumeStep } from "./volume-bar"

/**
 * возвращает текущее положение баланса
 * @returns {number}
 */
export const useCurrentBalance = (): number => useStore($currentBalance)

/**
 * возвращает шаг смещения положения баланса
 * @returns {number}
 */
export const currentBalanceStep = (): number => useStore($currentBalanceStep)

/**
 * возвращает текущее значение громкости
 * @returns {number}
 */
export const useCurrentVolume = (): number => useStore($currentVolume)

/**
 * возвращает текущее смещение полосы громкости
 * @returns {number}
 */
export const useCurrentVolumeStep = (): number => useStore($currentVolumeStep)

/**
 * возвращает вид отображения таймера
 * @returns {TIME_MODE}
 */
export const useTimeMode = (): TIME_MODE => useStore(winamp.$timeMode)

/**
 * возвращает разбитое время трека на минуты и секунды
 * @returns {Record<string, number>} { firstSecond, lastSecond, firstMinute, lastMinute }
 */
export const useTimer = (): Record<string, number> => useStore(progress.$timer)

/**
 *  возвращает состояние медиафайла
 * @returns {TMediaStatus}
 */
export const usePlayerState = (): TMediaStatus => useStore(winamp.$mediaStatus)

/**
 * clutterBar
 */
export const useClutterBar = () => useStore($clutterBar)

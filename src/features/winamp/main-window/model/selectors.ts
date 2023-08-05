import { useUnit } from "effector-react";

import { $currentBalance, $currentBalanceStep } from "./balance-bar";
import { $currentVolume, $currentVolumeStep } from "./volume-bar";
import { $clutterBar, progress, winamp } from "@/src/widgets/winamp";

import type { TimeMode, TMediaStatus } from "@/features/music/types";

/**
 * возвращает текущее положение баланса
 * @returns {number}
 */
export const useCurrentBalance = (): number => useUnit($currentBalance);

/**
 * возвращает шаг смещения положения баланса
 * @returns {number}
 */
export const useCurrentBalanceStep = (): number => useUnit($currentBalanceStep);

/**
 * возвращает текущее значение громкости
 * @returns {number}
 */
export const useCurrentVolume = (): number => useUnit($currentVolume);

/**
 * возвращает текущее смещение полосы громкости
 * @returns {number}
 */
export const useCurrentVolumeStep = (): number => useUnit($currentVolumeStep);

/**
 * возвращает вид отображения таймера
 * @returns {TimeMode}
 */
export const useTimeMode = (): TimeMode => useUnit(winamp.$timeMode);

/**
 * возвращает разбитое время трека на минуты и секунды
 * @returns {Record<string, number>} { firstSecond, lastSecond, firstMinute, lastMinute }
 */
export const useTimer = (): Record<string, number> => useUnit(progress.$timer);

/**
 *  возвращает состояние медиафайла
 * @returns {TMediaStatus}
 */
export const usePlayerState = (): TMediaStatus => useUnit(winamp.$mediaStatus);

/**
 * clutterBar
 */
export const useClutterBar = () => useUnit($clutterBar);

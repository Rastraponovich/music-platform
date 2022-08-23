import { $clutterBar, winampStates } from "@/features/media/winamp"
import { TWinampWindow } from "@/features/music/types"
import { useStore } from "effector-react"
import { $enabledAutoEQ, $enabledEQ, $minimized, $visibled } from "./model"

/**
 *
 * @returns {boolean}
 */
export const useMinimized = (): boolean => useStore($minimized)

/**
 *
 * @returns {boolean}
 */
export const useVisibled = (): boolean => useStore($visibled)

/**
 *
 * @returns {boolean}
 */
export const useAutoEQ = (): boolean => useStore($enabledAutoEQ)

/**
 * @returns {boolean}
 */
export const useEnabledEQ = (): boolean => useStore($enabledEQ)

/**
 * @returns {TWinampWindow}
 */
export const useWindowState = (): TWinampWindow => useStore(winampStates.$activeWindow)

/**
 *
 * @returns {Record<string, boolean>}
 */
export const useClutterBar = (): Record<string, boolean> => useStore($clutterBar)

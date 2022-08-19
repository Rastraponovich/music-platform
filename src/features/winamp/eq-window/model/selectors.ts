import { useStore } from "effector-react"
import { $minimized, $visibled } from "./model"

export const useMinimized = () => useStore($minimized)
export const useVisibled = () => useStore($visibled)

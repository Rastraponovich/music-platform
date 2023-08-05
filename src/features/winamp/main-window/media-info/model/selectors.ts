import { useStore } from "effector-react"
import { $enabledMarque, $marqueInfoText } from "./model"

export const useEnabledMarque = () => useStore($enabledMarque)
export const useMarqueInfoText = () => useStore($marqueInfoText)

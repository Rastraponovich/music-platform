import { useStore } from "effector-react"
import { $currentBalance, $currentBalanceStep } from "./model"

export const useCurrentBalance = () => useStore($currentBalance)
export const currentBalanceStep = () => useStore($currentBalanceStep)

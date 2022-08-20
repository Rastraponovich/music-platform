import { balance } from "@/features/media/winamp"
import { createEvent, createStore } from "effector"
import { CURRENT_BALANCE_OFFSET } from "../lib"

export const $currentBalance = createStore(0).on(balance.$currentBalance, (_, balance) => balance)

export const $currentBalanceStep = createStore(0).on($currentBalance, (_, currentBalance) => {
    switch (true) {
        case currentBalance < 0:
            return Math.ceil(currentBalance / CURRENT_BALANCE_OFFSET) + 1
        case currentBalance > 0:
            return Math.ceil((currentBalance / CURRENT_BALANCE_OFFSET) * -1) + 1
        default:
            return 0
    }
})

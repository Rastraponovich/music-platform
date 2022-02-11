import { getClientScope } from "@/hooks/useScope"
import { Nullable } from "@/types"
import { _snapBalanceValue } from "@/utils/utils"
import { Store, createEffect, scopeBind, createEvent, createStore, sample } from "effector"
import { ChangeEvent } from "react"
import { MediaElement } from "./types"

export const createWinampBalanceFactory = ($Media: Store<Nullable<MediaElement>>) => {
    const changeBalanceFx = createEffect<
        [Nullable<MediaElement>, ChangeEvent<HTMLInputElement>],
        void
    >(([media, event]) => {
        const value = _snapBalanceValue(Number(event.target.value))
        media!._balance.balance.value = value / 100
        const callSetBalanceScoped = scopeBind(setBalance, { scope: getClientScope()! })
        callSetBalanceScoped(value)
    })

    const setBalance = createEvent<number>()
    const changeBalance = createEvent<ChangeEvent<HTMLInputElement>>()
    const $currentBalance = createStore<number>(0).on(setBalance, (_, newBalance) => newBalance)
    //change balance from ui
    sample({
        clock: changeBalance,
        source: $Media,
        fn: (media, event) =>
            [media, event] as [Nullable<MediaElement>, ChangeEvent<HTMLInputElement>],

        target: changeBalanceFx,
    })

    return {
        $currentBalance,
        setBalance,
        changeBalance,
    }
}

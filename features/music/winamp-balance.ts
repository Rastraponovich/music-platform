import { getClientScope } from "@/hooks/useScope"
import { Nullable } from "@/types"
import { createEvent, createStore, sample, createEffect, Store, scopeBind } from "effector"
import { ChangeEvent } from "react"
import StereoBalanceNode from "../media/StereoBalanceNode"
import { MediaElement } from "./types"

const createWinampBalanceFactory = ($Media: Store<Nullable<MediaElement>>) => {
    const changeBalanceFx = createEffect<
        [Nullable<MediaElement>, ChangeEvent<HTMLInputElement>],
        void
    >(([media, event]) => {
        const value = Number(event.target.value)
        media!._balance.balance.value = value / 100
        const callSetBalanceScoped = scopeBind(setBalance, { scope: getClientScope()! })
        callSetBalanceScoped(value)
    })

    const resetBalanceFx = createEffect<Nullable<MediaElement>, void>((media) => {
        media!._balance.balance.value = 0
        const callSetBalanceScoped = scopeBind(setBalance, { scope: getClientScope()! })
        callSetBalanceScoped(0)
    })

    const setBalance = createEvent<number>()
    const changeBalance = createEvent<ChangeEvent<HTMLInputElement>>()
    const resetBalance = createEvent()
    const $currentBalance = createStore<number>(0).on(setBalance, (_, newBalance) => newBalance)
    //change balance from ui
    sample({
        clock: changeBalance,
        source: $Media,
        fn: (media, event) =>
            [media, event] as [Nullable<MediaElement>, ChangeEvent<HTMLInputElement>],

        target: changeBalanceFx,
    })

    sample({
        clock: resetBalance,
        source: $Media,
        fn: (Media, _) => Media,
        target: resetBalanceFx,
    })

    return {
        $currentBalance,
        setBalance,
        resetBalance,
        changeBalance,
    }
}

export { createWinampBalanceFactory }

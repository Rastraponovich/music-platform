import { createEvent, createEffect, restore, attach, forward } from "effector"
import { Router } from "next/router"

export const attachRouter = createEvent<Router>()
const $router = restore<Router>(attachRouter, null)

const pushFx = attach({
    source: $router,
    effect: (router, param) => router!.push(param),
})

export const callFetch = createEvent()

const fxFetch = createEffect(() => Promise.resolve(1))

forward({ from: callFetch, to: fxFetch })

forward({ from: fxFetch.done, to: pushFx.prepend(() => "/") })

import { attach, createEffect, createEvent, restore, sample } from "effector";
import { Router } from "next/router";

const fxFetchFx = createEffect(() => Promise.resolve(1));

export const attachRouter = createEvent<Router>();
export const callFetch = createEvent();

const $router = restore<Router>(attachRouter, null);

const pushFx = attach({
  source: $router,
  effect: (router, param) => router!.push(param),
});

sample({ clock: callFetch, target: fxFetchFx });

sample({ clock: fxFetchFx.done, fn: () => "/", target: pushFx });

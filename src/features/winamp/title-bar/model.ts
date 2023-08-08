import { createEvent, sample } from "effector";

import { winamp, winampStates } from "~/widgets/winamp";

import { WindowNames } from "./constants";

export const minimizeButtonClicked = createEvent();
export const shadeButtonClicked = createEvent();
export const closeButtonClicked = createEvent();

export const $shaded = winampStates.$shadePlayer.map((shaded) => shaded);

export const $isActiveWindow = winampStates.$activeWindow.map(
  (currentWindowName) => currentWindowName === WindowNames.PLAYER,
);

/**
 * when close button clicked
 */
sample({
  clock: closeButtonClicked,
  target: winamp.close,
});

/**
 * when shade button clicked
 */
sample({
  clock: shadeButtonClicked,
  target: winamp.toggleShadePlayer,
});

/**
 * when minimize button clicked
 */
sample({
  clock: minimizeButtonClicked,
  target: winamp.minimize,
});

import { createEvent, sample } from "effector";

import {
  $activeWindow,
  $shadePlayer,
  closeWinamp,
  minimizedWinamp,
  toggleShadePlayer,
} from "~/widgets/winamp";

import { WINDOW_NAME } from "./constants";

export const minimizeButtonClicked = createEvent();
export const shadeButtonClicked = createEvent();
export const closeButtonClicked = createEvent();

export const $shaded = $shadePlayer.map((shaded) => shaded);

export const $isActiveWindow = $activeWindow.map(
  (currentWindowName) => currentWindowName === WINDOW_NAME,
);

/**
 * when close button clicked
 */
sample({
  clock: closeButtonClicked,
  target: closeWinamp,
});

/**
 * when shade button clicked
 */
sample({
  clock: shadeButtonClicked,
  target: toggleShadePlayer,
});

/**
 * when minimize button clicked
 */
sample({
  clock: minimizeButtonClicked,
  target: minimizedWinamp,
});

import { duration, marqueInfo, progress } from "@/src/widgets/winamp";
import { sample, createEvent, createStore } from "effector";
import type { ChangeEvent, MouseEvent } from "react";

export const progressBarLifted = createEvent<MouseEvent<HTMLInputElement>>();
export const progressBarUplifted = createEvent<MouseEvent<HTMLInputElement>>();
export const sought = createEvent<ChangeEvent<HTMLInputElement>>();

export const $isPressed = createStore(false);
export const $currentDuration = duration.$currentTrackDuration.map((time) => time);
export const $currentTime = progress.$currentTime.map((time) => time);

/**
 * on lifted progress bar
 */
sample({
  clock: progressBarLifted,
  target: [marqueInfo.enabledMarqueInfo, progress.onmousedown],
});

/**
 * on lifted progress bar
 */
sample({
  clock: progressBarLifted,
  fn: () => true,
  target: $isPressed,
});

/**
 * on uplifted progress bar
 */
sample({
  clock: progressBarUplifted,
  target: [marqueInfo.disabledMarqueInfo, progress.onmouseup],
});

/**
 * on uplifted progress bar
 */
sample({
  clock: progressBarUplifted,
  fn: () => false,
  target: $isPressed,
});

/**
 * on seeking
 */
sample({
  clock: sought,
  target: progress.seekingCurrentTime,
});

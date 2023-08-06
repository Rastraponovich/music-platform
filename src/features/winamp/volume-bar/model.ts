import { createEvent, sample } from "effector";

import { marqueInfo, volume } from "@/src/widgets/winamp";

import type { ChangeEvent } from "react";

import { VOLUME_STEP } from "./constants";

export const volumeChanged = createEvent<ChangeEvent<HTMLInputElement>>();
export const volumebarLifted = createEvent();
export const volumebarUplifted = createEvent();

export const $volume = volume.$volume.map((volume) => volume);
export const $currentVolumePosition = $volume.map((volume) => Math.floor(volume / VOLUME_STEP));

/**
 * when volume changed
 * @todo refactoring
 */
sample({
  clock: volumeChanged,
  target: volume.changeVolume,
});

/**
 * when volume bar is pressed
 */
sample({
  clock: volumebarLifted,
  target: marqueInfo.enabledMarqueInfo,
});

/**
 * when volume bar is unpressed
 */
sample({
  clock: volumebarUplifted,
  target: marqueInfo.disabledMarqueInfo,
});

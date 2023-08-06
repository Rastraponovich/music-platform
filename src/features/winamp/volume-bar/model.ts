import { createEvent, sample } from "effector";

import { changeVolumeFx, marqueInfo, volume } from "@/src/widgets/winamp";

import type { ChangeEvent } from "react";

import { VOLUME_STEP } from "./constants";
import { getMarqueInfoText } from "./utils";

// events //
export const volumeChanged = createEvent<ChangeEvent<HTMLInputElement>>();
export const volumebarLifted = createEvent();
export const volumebarUplifted = createEvent();

// stores //
export const $volume = volume.$volume.map((volume) => volume);

const $marqueText = $volume.map((volume) => getMarqueInfoText(volume));

export const $currentVolumePosition = $volume.map((volume) => Math.floor(volume / VOLUME_STEP));

// runtime //
marqueInfo.$winampMarqueInfo.on($marqueText, (_, text) => text);

/**
 * when volume changed
 * @todo refactoring
 */
sample({
  clock: volumeChanged,
  fn: (event) => event.target.value,
  target: changeVolumeFx,
});

/**
 * when volume bar is pressed
 */
sample({
  clock: volumebarLifted,
  target: marqueInfo.enabledMarqueInfo,
});

/**
 * when volume bar is pressed set marque info text
 */
sample({
  clock: volumebarLifted,
  source: $marqueText,
  target: marqueInfo.$winampMarqueInfo,
});

/**
 * when volume bar is unpressed
 */
sample({
  clock: volumebarUplifted,
  target: marqueInfo.disabledMarqueInfo,
});

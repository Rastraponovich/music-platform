import { createEvent, sample } from "effector";

import { changeVolumeFx, marqueInfo, $volume, keyboardChangedVolumeFx } from "@/src/widgets/winamp";

import type { ChangeEvent } from "react";

import { VOLUME_STEP } from "./constants";
import { getMarqueInfoText } from "./utils";

// events //
export const volumeChanged = createEvent<ChangeEvent<HTMLInputElement>>();
export const keyboardVolumeChanged = createEvent<"up" | "down">();

export const volumebarLifted = createEvent();
export const volumebarUplifted = createEvent();

// stores //
export const $currentVolume = $volume.map((volume) => volume);

const $marqueText = $currentVolume.map((volume) => getMarqueInfoText(volume));

export const $currentVolumePosition = $currentVolume.map((volume) =>
  Math.floor(volume / VOLUME_STEP),
);

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
 * when volume changed by keyboard
 */
sample({
  clock: keyboardVolumeChanged,
  target: keyboardChangedVolumeFx,
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

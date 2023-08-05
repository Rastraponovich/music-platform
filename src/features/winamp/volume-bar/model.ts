import { createEvent, sample } from "effector";
import { ChangeEvent } from "react";
import { $currentVolume, $currentVolumeStep } from "../main-window/model";
import { marqueInfo, volume } from "@/src/widgets/winamp";

export const volumeChanged = createEvent<ChangeEvent<HTMLInputElement>>();
export const volumebarLifted = createEvent();
export const volumebarUplifted = createEvent();

export const $volume = $currentVolume.map((volume) => volume);

export const $currentVolumePosition = $currentVolumeStep.map((position) => position);

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

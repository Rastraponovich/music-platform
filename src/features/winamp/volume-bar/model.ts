import { createEvent, sample } from "effector";
import { debounce } from "patronum";

import {
  $activeWindow,
  $enabledMaruqeInfo,
  $volume,
  $winampMarqueInfo,
  changeVolumeFx,
  disabledMarqueInfo,
  enabledMarqueInfo,
  keyboardChangedVolumeFx,
} from "~/widgets/winamp";

import { VOLUME_STEP } from "./constants";
import { generateVolumeMaruqeText } from "./utils";

// events //
export const volumeChanged = createEvent<string>();
export const keyboardVolumeChanged = createEvent<KeyboardEvent>();

export const volumebarLifted = createEvent();
export const volumebarUplifted = createEvent();

// stores //
export const $currentVolume = $volume.map((volume) => volume);
export const $isActiveWindow = $activeWindow.map((activeWindow) => activeWindow === "PLAYER");

const $marqueText = $currentVolume.map((volume) => generateVolumeMaruqeText(volume));

export const $currentVolumePosition = $currentVolume.map((volume) =>
  Math.floor(volume / VOLUME_STEP),
);

// runtime //
$winampMarqueInfo.on($marqueText, (_, text) => text);

/**
 * when volume changed
 * @todo refactoring
 */
sample({
  clock: volumeChanged,
  target: changeVolumeFx,
});

/**
 * when volume changed by keyboard
 */
sample({
  clock: keyboardVolumeChanged,
  target: keyboardChangedVolumeFx,
});

const debouncedKeyboardVolumeChanged = debounce({
  source: keyboardVolumeChanged,
  timeout: 1000,
});

/**
 * when volume bar is pressed
 */
sample({
  clock: [volumebarLifted, keyboardVolumeChanged],
  target: enabledMarqueInfo,
});

/**
 * when volume bar is pressed set marque info text
 */
sample({
  clock: [volumebarLifted, keyboardVolumeChanged],
  source: $marqueText,
  filter: $enabledMaruqeInfo,
  target: $winampMarqueInfo,
});

/**
 * when volume bar is unpressed
 */
sample({
  clock: [volumebarUplifted, debouncedKeyboardVolumeChanged],
  target: disabledMarqueInfo,
});

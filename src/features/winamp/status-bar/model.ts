import { createEvent, sample } from "effector";

import {
  $clutterBar,
  $currentTrack,
  $mediaElement,
  $mediaStatus,
  $timeMode,
  $timer,
  changeClutterBar,
  toggleTimeMode,
} from "~/widgets/winamp";

export const toggleTimeModeButtonClicked = createEvent();

export const changedClutterBar = createEvent<string>();

export const $playerState = $mediaStatus.map((status) => status);
export const $timerValue = $timer.map((timer) => timer);
export const $currentTimeMode = $timeMode.map((timeMode) => timeMode);
export const $clutterbar = $clutterBar.map((bar) => bar);

export const $existTrack = $currentTrack.map((track) => !!track);
export const $mediaExist = $mediaElement.map((mediaElement) => !!mediaElement);

sample({
  clock: changedClutterBar,
  target: changeClutterBar,
});

sample({
  clock: toggleTimeModeButtonClicked,
  target: toggleTimeMode,
});

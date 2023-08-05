import { $clutterBar, changeClutterBar, progress, winamp } from "@/src/widgets/winamp";
import { createEvent, sample } from "effector";

export const toggleTimeModeButtonClicked = createEvent();

export const changedClutterBar = createEvent<string>();

export const $playerState = winamp.$mediaStatus.map((status) => status);
export const $timer = progress.$timer.map((timer) => timer);
export const $timeMode = winamp.$timeMode.map((timeMode) => timeMode);
export const $clutterbar = $clutterBar.map((bar) => bar);

sample({
  clock: changedClutterBar,
  target: changeClutterBar,
});

sample({
  clock: toggleTimeModeButtonClicked,
  target: winamp.toggleTimeMode,
});

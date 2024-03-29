import { createEvent, createStore, sample } from "effector";
import { reset } from "patronum";
import { $currentTrack } from "~/entity/winamp";

import {
  $currentTrackDuration,
  $currentTrackTime,
  changeCurrentTimeFx,
  disabledMarqueInfo,
  enabledMarqueInfo,
  keyChangeCurrentTimeFx,
  setCurrentTime_,
  setMarqueInfo,
} from "~/widgets/winamp";

import { generateMarqueSeekText } from "./utils";

// events //
/* changing time in keypress */
export const keyChangeCurrentTime = createEvent<string>();

/* when pressed */
export const progressBarLifted = createEvent();

/* when lifted */
export const progressBarUplifted = createEvent();

/* seeking track */
export const sought = createEvent<string>();

// stores //
/* allow seeking */
export const $allowSeeking = createStore(true);
export const $isPressed = createStore(false);
export const $seekingProgress = createStore(0);
export const $currentDuration = $currentTrackDuration.map((time) => time);
export const $currentTime = $currentTrackTime.map((time) => time);

// runtime //

/* set to original model current time when seeked */
$currentTrackTime.on($seekingProgress, (_, seekedTime) => seekedTime);

/* on lifted progress bar */
sample({
  clock: progressBarLifted,
  target: enabledMarqueInfo,
});

/* when lifted we must set marque info */
sample({
  clock: progressBarLifted,
  source: { seekedTime: $seekingProgress, duration: $currentTrackDuration },
  fn: ({ seekedTime, duration }) => generateMarqueSeekText(seekedTime, duration),
  target: setMarqueInfo,
});

/* on lifted progress bar */
$isPressed.on(progressBarLifted, () => true);

/* when lifted we must set disallow seeking */
$allowSeeking.on(progressBarLifted, () => false);

/* on uplifted progress bar */
sample({
  clock: progressBarUplifted,
  target: disabledMarqueInfo,
});

/* on uplifted progress bar */
$isPressed.on(progressBarUplifted, () => false);

/* on uplifted progress bar  we must set allow seeking */
$allowSeeking.on(progressBarUplifted, () => true);

/* on seeking */
$seekingProgress.on(sought, (_, progress) => Number(progress));

/* костыль бородыль, модель слушает изменение из основоного класса */
sample({
  clock: setCurrentTime_,
  filter: $allowSeeking,
  target: $currentTrackTime,
});

/**
 * when seeking time is end then temporary value set in currentTime
 */
sample({
  clock: progressBarUplifted,
  source: { allowSeeking: $allowSeeking, newTime: $seekingProgress },
  filter: $allowSeeking,
  target: changeCurrentTimeFx,
});

/**
 * change current position in track with keypres +5 -5 seconds
 */
sample({
  clock: keyChangeCurrentTime,
  filter: $allowSeeking,
  fn: (direction) => ({ direction }),
  target: keyChangeCurrentTimeFx,
});

/**
 * show in TrackListInfo seeking progress
 */
sample({
  clock: $seekingProgress,
  source: $currentTrackDuration,
  fn: generateMarqueSeekText,
  target: setMarqueInfo,
});

reset({
  clock: $currentTrack,
  target: $seekingProgress,
});

import { Nullable } from "@/types";
import { Store, createEffect, createEvent, createStore, sample } from "effector";
import { ChangeEvent, MouseEvent } from "react";
import { MediaElement, Track, TimeMode } from "./types";
import { reset } from "patronum";

type TrackTimer = {
  firstSecond: number;
  lastSecond: number;
  lastMinute: number;
  firstMinute: number;
};
const convertTime = (currentTime: number): TrackTimer => {
  const seconds = currentTime % 60;
  const minutes = Math.floor(currentTime / 60);

  const firstSecond = Math.floor(seconds / 10);
  const lastSecond = Math.floor(seconds % 10);
  const firstMinute = Math.floor(minutes / 10);
  const lastMinute = Math.floor(minutes % 10);

  return {
    firstSecond,
    lastSecond,
    firstMinute,
    lastMinute,
  };
};

export const createWinampProgressFactory = (
  $Media: Store<Nullable<MediaElement>>,
  $currentTrack: Store<Nullable<Track>>,
) => {
  const changeCurrentTimeFx = createEffect<
    { audio: HTMLAudioElement; newTime: number; allowSeeking: boolean },
    void
  >(({ audio, newTime, allowSeeking }) => {
    if (allowSeeking) {
      audio.currentTime = newTime;
    }
  });

  const keyChangeCurrentTimeFx = createEffect<{ audio: HTMLAudioElement; direction: string }, void>(
    ({ audio, direction }) => {
      if (direction === "forward") {
        audio.currentTime = audio.currentTime + 5;
      }

      if (direction === "backward") {
        audio.currentTime = audio.currentTime - 5;
      }
    },
  );

  const toggleTimeMode = createEvent();
  const setDuration = createEvent<number>();
  const onmousedown = createEvent<MouseEvent<HTMLInputElement>>();
  const onmouseup = createEvent<MouseEvent<HTMLInputElement>>();

  /**
   * set current time form ui
   */
  const setCurrentTime = createEvent<number>();

  /**
   * set current time from emitter
   */
  const changeCurrentTime = createEvent<number>();
  const seekingCurrentTime = createEvent<ChangeEvent<HTMLInputElement>>();

  /**
   * changing time in keypress
   */
  const keyChangeCurrentTime = createEvent<string>();

  const $timeMode = createStore<TimeMode>(TimeMode.ELAPSED);
  const $currentTrackDuration = createStore<number>(0);
  const $allowSeeking = createStore<boolean>(true);
  const $currentTime = createStore<number>(0);
  const $seekingProgress = createStore<number>(0);
  const $timer = createStore<TrackTimer>({
    firstSecond: 0,
    lastSecond: 0,
    firstMinute: 0,
    lastMinute: 0,
  });

  /**
   * remaining time in current Track
   */
  const $currentTrackTimeRemaining = createStore<number>(0);

  $timeMode.on(toggleTimeMode, (timeMode) =>
    timeMode === TimeMode.ELAPSED ? TimeMode.REMAINING : TimeMode.ELAPSED,
  );
  $currentTrackDuration.on(setDuration, (_, duration) => duration);

  /**
   * seeking in progressBar
   */
  $allowSeeking.on(onmousedown, () => false);
  $allowSeeking.on(onmouseup, () => true);
  $seekingProgress.on(seekingCurrentTime, (_, event) => Number(event.target.value));
  $currentTime.on($seekingProgress, (_, seekedTime) => seekedTime);

  /**
   * when seeking time is end then temporary value set in currentTime
   */
  sample({
    clock: onmouseup,
    source: $seekingProgress,
    target: changeCurrentTime,
  });

  sample({
    clock: setCurrentTime,
    filter: $allowSeeking,
    target: $currentTime,
  });

  /**
   * changing current Time from ui
   */
  sample({
    clock: changeCurrentTime,
    source: { media: $Media, allowSeeking: $allowSeeking },
    filter: ({ media, allowSeeking }) => media?._audio instanceof HTMLAudioElement && allowSeeking,
    fn: ({ media, allowSeeking }, newTime) => ({
      audio: media!._audio,
      newTime,
      allowSeeking,
    }),
    target: changeCurrentTimeFx,
  });

  /**
   * change current position in track with keypres +5 -5 seconds
   */
  sample({
    clock: keyChangeCurrentTime,
    source: { media: $Media, allowSeeking: $allowSeeking },
    filter: ({ media, allowSeeking }) => media?._audio instanceof HTMLAudioElement && allowSeeking,
    fn: ({ media }, direction) => ({ audio: media!._audio, direction }),

    target: keyChangeCurrentTimeFx,
  });

  sample({
    clock: $currentTime,
    source: $currentTrackDuration,
    fn: (duration, currentTime) => duration - currentTime,
    target: $currentTrackTimeRemaining,
  });

  sample({
    clock: $currentTime,
    source: $timeMode,
    filter: (timeMode) => timeMode === TimeMode.ELAPSED,
    fn: (_, currentTime) => convertTime(currentTime),
    target: $timer,
  });

  sample({
    clock: $currentTrackTimeRemaining,
    source: $timeMode,
    filter: (timeMode) => timeMode === TimeMode.REMAINING,
    fn: (_, currentTime) => convertTime(currentTime),
    target: $timer,
  });

  reset({
    clock: $currentTrack,
    target: [$timer, $currentTrackTimeRemaining, $currentTime, $seekingProgress],
  });

  return {
    $timer,
    $timeMode,
    $currentTime,
    $allowSeeking,
    $seekingProgress,
    $currentTrackDuration,
    $currentTrackTimeRemaining,
    onmouseup,
    onmousedown,
    setDuration,
    toggleTimeMode,

    setCurrentTime,
    changeCurrentTime,
    seekingCurrentTime,
    keyChangeCurrentTime,

    // changeCurrentTimeFx,
    // keyChangeCurrentTimeFx,
  };
};

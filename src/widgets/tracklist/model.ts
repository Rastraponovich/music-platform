import { combine, createEvent, sample } from "effector";
import { TimeMode, Track } from "~/entity/songs";
import { $currentTrack } from "~/entity/winamp";

import {
  $mediaStatus,
  $timeMode,
  $timer,
  onPauseClicked,
  onPlayClicked,
  selectTrackFromList,
} from "../winamp";

export const playButtonClicked = createEvent<Track>();

export const $playedTime = combine(
  $timer,
  $timeMode,
  ({ firstSecond, lastSecond, firstMinute, lastMinute }, timeMode) => {
    return `${
      timeMode === TimeMode.REMAINING ? "-" : ""
    } ${firstMinute}${lastMinute}:${firstSecond}${lastSecond}`;
  },
);

sample({
  clock: playButtonClicked,
  source: { currentTrack: $currentTrack, mediaStatus: $mediaStatus },
  filter: ({ currentTrack, mediaStatus }, clickedTrack) =>
    currentTrack?.id === clickedTrack.id && mediaStatus === "PLAYING",

  target: onPauseClicked,
});

sample({
  clock: playButtonClicked,
  source: { currentTrack: $currentTrack, mediaStatus: $mediaStatus },
  filter: ({ currentTrack, mediaStatus }, clickedTrack) =>
    currentTrack?.id === clickedTrack.id && mediaStatus !== "PLAYING",

  target: onPlayClicked,
});

sample({
  clock: playButtonClicked,
  source: $currentTrack,
  filter: (currentTrack, clickedTrack) => currentTrack?.id !== clickedTrack.id,
  fn: (_, track) => track,
  target: selectTrackFromList,
});

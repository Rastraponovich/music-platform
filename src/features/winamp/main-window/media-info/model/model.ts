import { createStore, sample } from "effector";

import { Nullable } from "@/types";

import { $currentTrack, $enabledMaruqeInfo, $winampMarqueInfo } from "~/widgets/winamp";

import { $currentPlayedTrackIndex } from "../../../playlist";
import { MARQUEE_MAX_LENGTH, MINUTE, SEPARATOR, isLong } from "../lib";

export const $enabledMarque = createStore<boolean>(false).on(
  $enabledMaruqeInfo,
  (_, state) => state,
);
export const $marqueInfoText = createStore<Nullable<string>>(null).on(
  $winampMarqueInfo,
  (_, info) => info,
);

export const $minute = createStore<Nullable<number>>(null).on($currentTrack, (_, currentTrack) => {
  if (currentTrack !== null) {
    return Math.floor(currentTrack.metaData.format.duration / MINUTE);
  }
  return null;
});

export const $second = createStore<Nullable<number>>(null).on($currentTrack, (_, currentTrack) => {
  if (currentTrack !== null) {
    return Math.floor(currentTrack.metaData.format.duration % MINUTE);
  }
  return null;
});

const $total = createStore<string>("");

sample({
  clock: $minute,
  source: $second,
  fn: (sec, min) => {
    if (sec && min) {
      return `(${min < 10 ? `0${min}` : min}:${sec < 10 ? `0${sec}` : sec})`;
    }
    return "";
  },
  target: $total,
});

const $text = createStore("");

sample({
  clock: $currentTrack,
  source: { currentId: $currentPlayedTrackIndex, total: $total },

  fn: ({ currentId, total }, currentTrack) => {
    if (currentTrack)
      return `${currentId !== null && currentId + 1}. ${currentTrack.artist} - ${
        currentTrack.name
      }   ${total}`;
    return "";
  },
  target: $text,
});

export const $trackName = createStore(SEPARATOR);

sample({
  clock: $text,
  fn: (text) =>
    isLong(text) ? `${text}${SEPARATOR}${text}` : text.padEnd(MARQUEE_MAX_LENGTH, " "),
  target: $trackName,
});

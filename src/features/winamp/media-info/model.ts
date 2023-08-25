import { createStore, sample } from "effector";

import { Nullable } from "@/types";

import { $currentTrack, $enabledMaruqeInfo, $winampMarqueInfo } from "~/widgets/winamp";

import { $currentPlayedTrackIndex } from "../playlist";
import { MARQUEE_MAX_LENGTH, MINUTE, SEPARATOR } from "./constants";
import { isLong } from "./utils";

export const $enabledMarque = createStore(false);
export const $marqueInfoText = createStore<Nullable<string>>(null);

export const $minute = createStore<Nullable<number>>(null);
export const $second = createStore<Nullable<number>>(null);
export const $total = createStore("");
export const $text = createStore("");
export const $trackName = createStore(SEPARATOR);

$enabledMarque.on($enabledMaruqeInfo, (_, state) => state);

$marqueInfoText.on($winampMarqueInfo, (_, info) => info);

$minute.on($currentTrack, (_, currentTrack) => {
  if (currentTrack !== null) {
    return Math.floor(currentTrack.metaData.format.duration / MINUTE);
  }
  return null;
});

$second.on($currentTrack, (_, currentTrack) => {
  if (currentTrack !== null) {
    return Math.floor(currentTrack.metaData.format.duration % MINUTE);
  }
  return null;
});

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

sample({
  clock: $text,
  fn: (text) =>
    isLong(text) ? `${text}${SEPARATOR}${text}` : text.padEnd(MARQUEE_MAX_LENGTH, " "),
  target: $trackName,
});

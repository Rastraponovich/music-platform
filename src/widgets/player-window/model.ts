import { combine } from "effector";
import { PlayerState, WinampState } from "~/entity/songs";

import { $currentPlayedTrackIndex } from "~/features/winamp/playlist";

import { $currentTrack, $mediaStatus, $winampState } from "../winamp";

export const $track = $currentTrack.map((track) => track);

export const $currentTrackId = $currentPlayedTrackIndex.map((id) => id);

export const $isPlayerNotStopped = $mediaStatus.map((status) => status !== PlayerState.STOPPED);

export const $isWinampClosed = $winampState.map((state) => state === WinampState.CLOSED);

export const $showingTicker = combine(
  $isPlayerNotStopped,
  $isWinampClosed,
  (isNotStopped, isWinampClosed) => {
    return isNotStopped && !isWinampClosed;
  },
);

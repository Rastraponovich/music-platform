import { combine } from "effector";

//TODO
import { PlayerState, WinampState } from "@/features/music/constants";

import { $currentPlayedTrackIndex } from "~/features/winamp/playlist";

import { $currentTrack, $mediaStatus, winampStates } from "../winamp";

export const $track = $currentTrack.map((track) => track);

export const $currentTrackId = $currentPlayedTrackIndex.map((id) => id);

export const $isPlayerNotStopped = $mediaStatus.map((status) => status !== PlayerState.STOPPED);

export const $isWinampClosed = winampStates.$winampState.map(
  (state) => state === WinampState.CLOSED,
);

export const $showingTicker = combine(
  $isPlayerNotStopped,
  $isWinampClosed,
  (isNotStopped, isWinampClosed) => {
    return isNotStopped && !isWinampClosed;
  },
);

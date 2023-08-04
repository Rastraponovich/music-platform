import { combine } from "effector";
import { playlist, winamp, winampStates } from "../winamp";
import { PlayerState, WinampState } from "@/features/music/constants";

export const $track = winamp.$currentTrack.map((track) => track);

export const $currentTrackId = playlist.$currentPlayedTrackIndex.map((id) => id);

export const $isPlayerNotStopped = winamp.$mediaStatus.map(
  (status) => status !== PlayerState.STOPPED,
);

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

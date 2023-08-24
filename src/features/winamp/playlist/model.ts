import { combine, createEvent, createStore, sample } from "effector";
import { and, not } from "patronum";
import { $songs, Track } from "~/entity/songs";
import { MEDIA_STATUS, WINAMP_STATE } from "~/entity/winamp";

import type { Nullable } from "@/types";
import { convertTimeToString } from "@/utils/utils";

import {
  $currentTrack,
  $currentTrackDuration,
  $mediaStatus,
  $shuffled,
  $winampState,
  loadUrl,
  playAllTracksFromList,
  playNextTrack,
  playNextTrackIsOneInPlayListFx,
  prevTrackClicked,
  removeTrackFromPlaylist,
  selectTrackFromList,
  startPlayingFx,
} from "~/widgets/winamp";
import { generateRandomId } from "~/widgets/winamp/utils";

export const toggleVisiblePlaylist = createEvent();
export const addTrackToPlaylist = createEvent<Track>();
export const selectTrackInPlaylist = createEvent<number>();
export const setCurrentPlayedTrackIndex = createEvent<number>();
export const doubleClickedTrackInPlaylist = createEvent<number>();

export const $playlist = createStore<Track[]>([]);
export const $visiblePlaylist = createStore(true);
export const $durationTracksInPlaylist = createStore(0);
export const $removedTrackIndex = createStore<Nullable<number>>(null);
export const $selectedTrackInPlaylist = createStore<Nullable<number>>(null);
export const $currentPlayedTrackIndex = createStore<Nullable<number>>(null);

export const $playlistLength = $playlist.map((tracks) => tracks.length);
export const $playlistNotEmpty = $playlist.map((tracks) => tracks.length > 0);
export const $playlistHasOneTrack = $playlist.map((tracks) => tracks.length === 1);
export const $playListHasMultipleTracks = $playlist.map((tracks) => tracks.length > 1);

export const $diffTrackLength = combine(
  { current: $currentTrackDuration, total: $durationTracksInPlaylist },
  ({ current, total }) => {
    return `${convertTimeToString(current)}/${convertTimeToString(total)}`;
  },
);

$playlist.on(addTrackToPlaylist, (tracks, track) => [...tracks, track]);

$playlist.on(selectTrackFromList, (_, track) => [track]);

$playlist.on(removeTrackFromPlaylist, (tracks, id) => tracks.filter((_, index) => index !== id));

$selectedTrackInPlaylist.reset(removeTrackFromPlaylist);

$currentPlayedTrackIndex.on(selectTrackFromList, () => 0);

$selectedTrackInPlaylist.on(selectTrackInPlaylist, (_, trackIndex) => trackIndex);

$currentPlayedTrackIndex.on(
  [setCurrentPlayedTrackIndex, doubleClickedTrackInPlaylist],
  (_, id) => id,
);

$durationTracksInPlaylist.on($playlist, (_, tracks) =>
  tracks.reduce((total, current) => total + current.metaData.format.duration, 0),
);

sample({
  clock: removeTrackFromPlaylist,
  source: $currentPlayedTrackIndex,
  filter: (currentIndex, removedIndex) => {
    if (currentIndex && currentIndex > removedIndex) return true;
    return false;
  },
  fn: (currentIndex) => currentIndex! - 1,
  target: $currentPlayedTrackIndex,
});

sample({
  clock: $currentPlayedTrackIndex,
  source: $playlist,
  filter: (_, id) => id !== null,
  fn: (playlist, id) => playlist[id!],
  target: $currentTrack,
});

//when playlist is not empty check currentTrackIndex in playlist if not last put next, otherwise put first
const playNextTrackNoShuffle = sample({
  clock: playNextTrack,
  source: { currentPlayedTrackIndex: $currentPlayedTrackIndex, playlistLength: $playlistLength },
  filter: and($playlistNotEmpty, not($shuffled)),

  fn: ({ currentPlayedTrackIndex, playlistLength }) => {
    const lastTrack = currentPlayedTrackIndex === playlistLength! - 1;

    if (lastTrack) return 0;
    return currentPlayedTrackIndex! + 1;
  },
});

//set new Track index in currentPlayedTrackIndexPlaylist
sample({
  clock: playNextTrackNoShuffle,
  fn: (newTrackIndex) => newTrackIndex,
  target: $currentPlayedTrackIndex,
});

// when Shuffle is ON ==> //
/**
 * if click next track when shuffled and playlist have 1 track
 */
sample({
  clock: playNextTrack,
  filter: and($playlistHasOneTrack, $shuffled),
  target: playNextTrackIsOneInPlayListFx,
});

/**
 * if click next track when shuffled and playlist have more than 1 track
 */
sample({
  clock: playNextTrack,
  source: { playlistLength: $playlistLength, currentPlayedTrackIndex: $currentPlayedTrackIndex },
  filter: and($playListHasMultipleTracks, $shuffled),
  fn: ({ playlistLength, currentPlayedTrackIndex }) => {
    if (currentPlayedTrackIndex !== null) {
      return generateRandomId(playlistLength, currentPlayedTrackIndex);
    }

    return 0;
  },
  target: $currentPlayedTrackIndex,
});

// <== end region //

//setting new Track in CurrentTrack
sample({
  clock: $currentPlayedTrackIndex,
  source: $playlist,
  filter: (_, newTrackIndex) => newTrackIndex !== null,
  fn: (playlist, newTrackIndex) => playlist[newTrackIndex as number],
  target: loadUrl,
});

sample({
  clock: doubleClickedTrackInPlaylist,
  target: startPlayingFx,
});

// prev track play clicked when not shuffled ==> //
/**
 * somthing in logic wrong. need to deep testing
 */
sample({
  clock: prevTrackClicked,
  source: { playlist: $playlist, currentPlayedTrackIndex: $currentPlayedTrackIndex },
  filter: and($playlistNotEmpty, not($shuffled)),

  fn: ({ playlist, currentPlayedTrackIndex }) => {
    if (currentPlayedTrackIndex === 0) return playlist.length - 1;

    return currentPlayedTrackIndex! - 1;
  },
  target: setCurrentPlayedTrackIndex,
});

// <== end region //

// prev track play clicked when shuffled  ==> //
sample({
  clock: prevTrackClicked,
  source: { playlistLength: $playlistLength, currentPlayedTrackIndex: $currentPlayedTrackIndex },
  filter: and($playlistNotEmpty, $shuffled),

  fn: ({ playlistLength, currentPlayedTrackIndex }) => {
    return generateRandomId(playlistLength, currentPlayedTrackIndex!);
  },
  target: setCurrentPlayedTrackIndex,
});

// <== end region //

sample({
  clock: playAllTracksFromList,
  source: $songs,
  fn: (songs) => [...songs],
  target: $playlist,
});

sample({
  clock: $winampState,
  filter: (state) =>
    state === WINAMP_STATE.CLOSED ||
    state === WINAMP_STATE.MINIMIZED ||
    state === WINAMP_STATE.DESTROYED,
  fn: () => false,
  target: $visiblePlaylist,
});

sample({
  clock: $winampState,
  filter: (state) => state === WINAMP_STATE.OPENED || state === WINAMP_STATE.TRACKLOADED,
  fn: () => true,
  target: $visiblePlaylist,
});

$mediaStatus.on(doubleClickedTrackInPlaylist, () => MEDIA_STATUS.STOPPED);

/* inline sample */
$currentPlayedTrackIndex.on(playAllTracksFromList, () => 0);

$visiblePlaylist.on(toggleVisiblePlaylist, (visible) => !visible);

$removedTrackIndex.reset([doubleClickedTrackInPlaylist, setCurrentPlayedTrackIndex]);

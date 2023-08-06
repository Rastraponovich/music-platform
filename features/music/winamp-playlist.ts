import { createEvent, createStore } from "effector";

import type { Nullable } from "@/types";
import type { Track } from "./types";

export const createWinampPlaylistFactory = () => {
  const toggleVisiblePlaylist = createEvent();
  const addTrackToPlaylist = createEvent<Track>();
  const selectTrackInPlaylist = createEvent<number>();
  const setCurrentPlayedTrackIndex = createEvent<number>();
  const doubleClickedTrackInPlaylist = createEvent<number>();

  const $playlist = createStore<Track[]>([]);
  const $visiblePlaylist = createStore<boolean>(true);
  const $durationTracksInPlaylist = createStore<number>(0);
  const $removedTrackIndex = createStore<Nullable<number>>(null);
  const $selectedTrackInPlaylist = createStore<Nullable<number>>(null);
  const $currentPlayedTrackIndex = createStore<Nullable<number>>(null);

  const $playlistLength = $playlist.map((tracks) => tracks.length);

  $playlist.on(addTrackToPlaylist, (tracks, track) => [...tracks, track]);

  $selectedTrackInPlaylist.on(selectTrackInPlaylist, (_, trackIndex) => trackIndex);

  $currentPlayedTrackIndex.on(
    [setCurrentPlayedTrackIndex, doubleClickedTrackInPlaylist],
    (_, id) => id,
  );

  $durationTracksInPlaylist.on($playlist, (_, tracks) =>
    tracks.reduce((total, current) => total + current.metaData.format.duration, 0),
  );

  $visiblePlaylist.on(toggleVisiblePlaylist, (state, _) => !state);

  $removedTrackIndex.reset([doubleClickedTrackInPlaylist, setCurrentPlayedTrackIndex]);

  return {
    $playlist,
    addTrackToPlaylist,
    $playlistLength,
    $selectedTrackInPlaylist,
    selectTrackInPlaylist,
    doubleClickedTrackInPlaylist,
    $currentPlayedTrackIndex,
    setCurrentPlayedTrackIndex,
    $durationTracksInPlaylist,
    $visiblePlaylist,
    toggleVisiblePlaylist,
    $removedTrackIndex,
  };
};

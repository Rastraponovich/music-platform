import { createEvent, sample } from "effector";

import type { Song } from "@/src/entity/songs/lib";

import { addTrackToPlaylist } from "../winamp/playlist";

export const addToPlaylistButtonClicked = createEvent<Song>();

sample({
  clock: addToPlaylistButtonClicked,
  target: addTrackToPlaylist,
});

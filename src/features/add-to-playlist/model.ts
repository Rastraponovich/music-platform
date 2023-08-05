import { sample, createEvent } from "effector";

import { playlist } from "@/src/widgets/winamp/model";

import type { Song } from "@/src/entity/songs/lib";

export const addToPlaylistButtonClicked = createEvent<Song>();

sample({
  clock: addToPlaylistButtonClicked,
  target: playlist.addTrackToPlaylist,
});

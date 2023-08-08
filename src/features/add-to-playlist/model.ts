import { createEvent, sample } from "effector";

import type { Song } from "@/src/entity/songs/lib";
import { playlist } from "@/src/widgets/winamp/model";

export const addToPlaylistButtonClicked = createEvent<Song>();

sample({
  clock: addToPlaylistButtonClicked,
  target: playlist.addTrackToPlaylist,
});

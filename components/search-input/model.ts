import { combine, createEvent, createStore, sample } from "effector";
import { not } from "patronum";

import { $songs, Song } from "@/src/entity/songs";
import { winamp } from "@/src/widgets/winamp";

export const closed = createEvent();
export const opened = createEvent();
export const songSelected = createEvent<Song>();

export const searchChanged = createEvent<string>();

export const $isOpened = createStore(false);
export const $searchString = createStore("");

$isOpened.on(opened, () => true);
$isOpened.on(closed, () => false);

$searchString.on(searchChanged, (_, search) => search);

export const $filteredSongs = combine(
  {
    songs: $songs,
    searchString: $searchString,
  },
  ({ songs, searchString }) => {
    return songs.filter(
      ({ artist, name }) =>
        artist.toLowerCase().includes(searchString.toLowerCase()) ||
        name.toLocaleLowerCase().includes(searchString.toLocaleLowerCase()),
    );
  },
);

sample({
  clock: $searchString,
  filter: not($isOpened),
  fn: (search) => search.length > 0,
  target: $isOpened,
});

sample({
  clock: songSelected,
  target: [winamp.selectTrackFromList, closed],
});

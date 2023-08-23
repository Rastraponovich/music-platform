import { combine, createEvent, createStore, sample } from "effector";
import { not, reset } from "patronum";
import { $songs, Song } from "~/entity/songs";

export const searchChanged = createEvent<string>();
export const nameChanged = createEvent<string>();
export const songSelected = createEvent<Song>();
export const formSubmitted = createEvent();
export const toggledDropdown = createEvent();
export const modalToggled = createEvent();

export const $name = createStore("");
export const $searchString = createStore("");
export const $dropDownIsOpened = createStore(false);
export const $modalIsOpened = createStore(false);

export const $songsSelected = createStore<Song[]>([]);

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

$name.on(nameChanged, (_, name) => name);
$searchString.on(searchChanged, (_, search) => search);
$dropDownIsOpened.on(toggledDropdown, (state) => !state);

$modalIsOpened.on(modalToggled, (state) => !state);
reset({
  clock: not($modalIsOpened),
  target: [$songsSelected, $dropDownIsOpened, $name, $searchString],
});

sample({
  clock: $searchString,
  filter: not($dropDownIsOpened),
  fn: (search) => search.length > 0,
  target: $dropDownIsOpened,
});

sample({
  clock: songSelected,
  source: $songsSelected,

  fn: (songs, song) => {
    const existingSong = songs.find((item) => item.id === song.id);

    if (existingSong) {
      return songs.filter((item) => item.id !== song.id);
    }

    return [...songs, song];
  },
  target: $songsSelected,
});

import { createEvent, createStore, sample } from "effector";

import { GENRE_FILTER, SUBGENRE_FILTER } from "./constants";

export type Genre = {
  id: number;
  name: string;
};

export const genreChanged = createEvent<{ id: number }>();
export const subGenreChanged = createEvent<{ id: number }>();

export const $genres = createStore<Genre[]>(GENRE_FILTER);
export const $subGenres = createStore<Genre[]>(SUBGENRE_FILTER);

export const $genreIdSelected = createStore<number | null>(null);
export const $subGenreIdSelected = createStore<number | null>(null);

sample({
  clock: genreChanged,
  source: $genreIdSelected,
  fn: (selectedId, { id }) => {
    if (selectedId === id) return null;
    return id;
  },
  target: $genreIdSelected,
});

sample({
  clock: subGenreChanged,
  source: $subGenreIdSelected,
  fn: (selectedId, { id }) => {
    if (selectedId === id) return null;
    return id;
  },
  target: $subGenreIdSelected,
});

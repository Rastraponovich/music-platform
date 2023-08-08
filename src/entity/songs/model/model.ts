import { createEvent, createStore, sample } from "effector";
import { debounce } from "patronum";
import { ChangeEvent } from "react";

import { songLib } from "..";
import { Song } from "../lib";
import { getAllSongsFx, saveSongFx, searchTrackFx } from "./api";

const getSongs = createEvent();

const searchTrack = createEvent<string>();

const searchTrackNameFiled = createStore<string>("").on(searchTrack, (_, trackName) => trackName);

const debouncedSearch = debounce({
  source: searchTrackNameFiled,
  timeout: 500,
  target: searchTrackFx,
});

sample({
  clock: getSongs,
  target: getAllSongsFx,
});

export const $songs = createStore<songLib.Song[]>([])
  .on(getAllSongsFx.doneData, (_, res) => res.data[0])
  .on(searchTrackFx.doneData, (_, res) => res.data[0]);

export const $countSongs = createStore<number>(0).on(
  getAllSongsFx.doneData,
  (_, res) => res.data[1],
);

const $currentSong = createStore<songLib.Song>({ userId: 5 } as songLib.Song)
  .on(saveSongFx.doneData, (_, res) => res.data)
  .reset(getSongs);

const changeSong = createEvent<ChangeEvent<HTMLInputElement>>();

sample({
  clock: changeSong,
  source: $currentSong,
  fn: (song, event) => ({ ...song, [event.target.name]: event.target.value }),
  target: $currentSong,
});

const uploadFile = createEvent<ChangeEvent<HTMLInputElement>>();

export const $files = createStore<{ music: File; image: File }>({
  music: {} as File,
  image: {} as File,
});

sample({
  clock: uploadFile,
  source: $files,
  fn: (files, event) => ({ ...files, [event.target.name]: event.target.files![0] }),
  target: $files,
});

const submitted = createEvent<ChangeEvent<HTMLFormElement>>();

submitted.watch((e: ChangeEvent<HTMLFormElement>) => e.preventDefault());

sample({
  clock: submitted,
  source: [$currentSong, $files],
  fn: ([song, files], _) => ({ ...song, ...files }) as songLib.Song & { image: File; music: File },
  target: saveSongFx,
});

export const $favoritesTracks = createStore<Song["id"][]>([]);

export const addToFavoriteButtonClicked = createEvent<Song["id"]>();

sample({
  clock: addToFavoriteButtonClicked,
  source: $favoritesTracks,
  fn: (favTracks, id) => {
    const condition = favTracks.some((track) => track === id);

    if (condition) return favTracks.filter((track) => track !== id);

    return [...favTracks, id];
  },
  target: $favoritesTracks,
});

export const actions = {
  getSongs,
  submitted,
  changeSong,
  uploadFile,
  searchTrack,
  addToFavoriteButtonClicked,
};

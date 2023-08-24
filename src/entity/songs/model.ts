import { attach, createEvent, createStore, sample } from "effector";
import type { Playlist } from "~/entity/playlists";

import { api } from "~/shared/api";

export type Song = {
  id?: number;
  name: string;
  artist: string;
  isActive: boolean;
  path: string;
  cover: string;
  likes: number;
  comments: number[];
  userId?: number;
  user?: unknown;
  metaData: {
    format: {
      tagTypes?: string[];
      trackInfo?: unknown[];
      lossless?: boolean;
      container?: string;
      codec?: string;
      tool?: string;
      sampleRate: number;
      numberOfChannels: number;
      numberOfSamples?: number;
      bitrate: number;
      codecProfile?: string;
      duration: number;
    };
    native: { [key: string]: { id: string; value: string }[] };
    quality: {
      warnings: {
        message: string;
      }[];
    };
    common: {
      track: { no: Nullable<number>; of: Nullable<number> };
      disk: { no: Nullable<number>; of: Nullable<number> };
      movementIndex?: unknown;
      encodersettings?: string;
    };
  };
  playerPlayListId?: string | null;
  playlists?: Playlist[];
  createdAt: Date | string;
  updatedAt: Date | string;
  deletedAt: Date | string | null;
};

const songsGetFx = attach({
  effect: api.songs.songsGetFx,
  mapParams: () => ({}),
});

export const songsGet = createEvent();

export const songValueChanged = createEvent<{ [key: string]: string }>();

export const trackSearched = createEvent<string>();

export const fileUploaded = createEvent<{ [key: string]: File }>();

export const formSubmitted = createEvent();

export const addToFavoriteButtonClicked = createEvent<Song["id"]>();

export const $searchTrackNameFiled = createStore("");

export const $songs = createStore<Song[]>([]);
export const $songsCount = createStore<number>(0);

const $currentSong = createStore<Song>({ userId: 5 } as Song);

export const $files = createStore<{ music: File; image: File }>({
  music: {} as File,
  image: {} as File,
});

export const $favoritesTracks = createStore<Song["id"][]>([]);

const songCreateFx = attach({
  effect: api.songs.songCreateFx,
  source: { song: $currentSong, files: $files },
  mapParams(_, { song, files }) {
    return {
      song,
      ...files,
    };
  },
});

const songsSearchFx = attach({
  effect: api.songs.songsSearchFx,
  source: { name: $searchTrackNameFiled },
});

$songs.on(songsGetFx.doneData, (_, [songs]) => songs);

$songs.on(songsSearchFx.doneData, (_, res) => res[0]);

$songsCount.on(songsGetFx.doneData, (_, res) => res[1]);

$currentSong.on(songCreateFx.doneData, (_, res) => res);
$currentSong.reset(songsGet);

$searchTrackNameFiled.on(trackSearched, (_, trackName) => trackName);

// debounce({
//   source: $searchTrackNameFiled,
//   timeout: 500,
//   target: searchTrackFx,
// });

sample({
  clock: songsGet,
  target: songsGetFx,
});

sample({
  clock: songValueChanged,
  source: $currentSong,
  fn: (song, value) => ({ ...song, value }),
  target: $currentSong,
});

sample({
  clock: fileUploaded,
  source: $files,
  fn: (files, file) => ({ ...files, file }),
  target: $files,
});

sample({
  clock: formSubmitted,
  target: songCreateFx,
});

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

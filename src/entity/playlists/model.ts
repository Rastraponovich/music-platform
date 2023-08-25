import { attach, createEvent, createStore, sample } from "effector";

import { api } from "~/shared/api";

export type Playlist = {
  id?: number;
  name: string;
  isActive: boolean;
  comments: unknown[];
  creatorId: number;
  creator: unknown;
  songs: unknown[];
};

const playlistsGetFx = attach({
  effect: api.playlists.playlistsGetFx,
});

const playlistGetFx = attach({
  effect: api.playlists.playlistGetFx,
});

export const playlistsGet = createEvent();
export const playlistGet = createEvent<number>();
export const playlistChanged = createEvent<{ [key: string]: string }>();
export const formSubmitted = createEvent();

export const $currentPlaylist = createStore<Playlist>({ creatorId: 5 } as Playlist);
export const $playlists = createStore<Playlist[]>([]);
export const $playlistsCount = createStore(0);

const playlistSaveFx = attach({
  effect: api.playlists.playlistUpdateFx,
  source: $currentPlaylist,
  mapParams(_, playlist) {
    return { id: playlist.id ?? 0, playlist };
  },
});

sample({
  clock: playlistsGet,
  target: playlistsGetFx,
});

$playlists.on(playlistsGetFx.doneData, (_, res) => res[0]);

$playlistsCount.on(playlistsGetFx.doneData, (_, res) => res[1]);

sample({
  clock: playlistGet,
  fn: (id) => ({ id }),
  target: playlistGetFx,
});

$currentPlaylist.on(playlistGetFx.doneData, (_, res) => res);
$currentPlaylist.reset(playlistsGet);

sample({
  clock: playlistChanged,
  source: $currentPlaylist,
  fn: (playlist, value) => ({ ...playlist, value }),
  target: $currentPlaylist,
});

sample({
  clock: formSubmitted,
  source: $currentPlaylist,
  filter: (playlist) => !!playlist.id,
  target: playlistSaveFx,
});

$currentPlaylist.on(playlistSaveFx.doneData, (_, res) => res);

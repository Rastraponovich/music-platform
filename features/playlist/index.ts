import axios, { AxiosResponse } from "axios";
import { createEffect, createEvent, createStore, sample } from "effector";
import { ChangeEvent } from "react";

import { TResponse } from "@/types";

import { PlayListAPI } from "./playlist-api";
import { Playlist } from "./types";

const getPlaylists = createEvent();

sample({
  clock: getPlaylists,
  target: PlayListAPI.getAllPlayListsFx,
});

const $playlists = createStore<Playlist[]>([]).on(
  PlayListAPI.getAllPlayListsFx.doneData,
  (_, res) => res.data[0],
);
const $playlistsCount = createStore<number>(0).on(
  PlayListAPI.getAllPlayListsFx.doneData,
  (_, res) => res.data[1],
);

const getOnePlayList = createEvent<number>();

sample({
  clock: getOnePlayList,
  fn: (id) => id,
  target: PlayListAPI.getOnePlaylistFx,
});

const $currentPlaylist = createStore<Playlist>({ creatorId: 5 } as Playlist)
  .on(PlayListAPI.getOnePlaylistFx.doneData, (_, res) => res.data)
  .reset(getPlaylists);

const changePlaylist = createEvent<ChangeEvent<HTMLInputElement>>();

sample({
  clock: changePlaylist,
  source: $currentPlaylist,
  fn: (store, event) => ({ ...store, [event.target.name]: event.target.value }),
  target: $currentPlaylist,
});

const submitted = createEvent<ChangeEvent<HTMLFormElement>>();

submitted.watch((e: ChangeEvent<HTMLFormElement>) => e.preventDefault());

sample({
  clock: submitted,
  source: $currentPlaylist,
  fn: (playlist, _) => playlist,
  target: PlayListAPI.savePlaylistFx,
});

sample({
  clock: PlayListAPI.savePlaylistFx.doneData,
  fn: (res) => res.data,
  target: $currentPlaylist,
});

export { $playlists, getPlaylists, $playlistsCount, $currentPlaylist, changePlaylist, submitted };

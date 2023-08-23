import { createEffect } from "effector";

import { Playlist } from "@/src/entity/playlists";

import { externalRequest } from "../client";

export const playlistsGetFx = createEffect<void, [Playlist[], number]>(async () => {
  const response = await externalRequest("/api/playlists");

  return await response.json();
});

export const playlistGetFx = createEffect<{ id: number }, Playlist>(async ({ id }) => {
  const response = await externalRequest(`/api/playlists/${id}`);

  return await response.json();
});

export const playlistCreateFx = createEffect<{ playlist: Playlist }, unknown>(
  async ({ playlist }) => {
    const response = await externalRequest("/api/playlists", "POST", playlist);

    return await response.json();
  },
);

export const playlistUpdateFx = createEffect<{ id: number; playlist: Playlist }, Playlist>(
  async ({ id, playlist }) => {
    const response = await externalRequest(`/api/playlists/${id}`, "PUT", playlist);

    return await response.json();
  },
);

export const playlistDeleteFx = createEffect<{ id: number }, unknown>(async ({ id }) => {
  const response = await externalRequest(`/api/playlists/${id}`, "DELETE");

  return await response.json();
});

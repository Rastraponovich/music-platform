import { TResponse } from "@/types";
import { externalAPI } from "@/utils/axiosInstanse";
import { AxiosResponse } from "axios";
import { createEffect } from "effector";
import { Playlist } from "./types";

const getAllPlayListsAPI = async () => await externalAPI.get("/playlists");
const getOnePlayListAPI = async (id: number) => await externalAPI.get(`/playlists/${id}`);
const deleteOnePlayListAPI = async (id: number) => await externalAPI.delete(`/playlists/${id}`);

const savePlayListAPI = async (playlist: Playlist) =>
  await externalAPI.post("/playlists", playlist);

const updatePlayListAPI = async ({ id, playlist }: { id: number; playlist: Playlist }) =>
  await externalAPI.patch(`/playlists/${id}`, playlist);

const getAllPlayListsFx = createEffect<unknown, AxiosResponse<TResponse<Playlist>>, Error>(
  getAllPlayListsAPI,
);
const savePlaylistFx = createEffect<Playlist, AxiosResponse<Playlist>, Error>(savePlayListAPI);

const getOnePlaylistFx = createEffect<number, AxiosResponse<Playlist>, Error>(getOnePlayListAPI);

const updatePlaylistFx = createEffect<
  { id: number; playlist: Playlist },
  AxiosResponse<Playlist>,
  Error
>(updatePlayListAPI);

const deleteOnePlaylistFx = createEffect<number, AxiosResponse<Playlist>, Error>(
  deleteOnePlayListAPI,
);

const PlayListAPI = {
  getAllPlayListsFx,
  savePlaylistFx,
  getOnePlaylistFx,
  updatePlaylistFx,
  deleteOnePlaylistFx,
};

export { PlayListAPI };

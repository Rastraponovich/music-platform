import { TResponse } from "@/types";
import { externalAPI } from "@/utils/axiosInstanse";
import axios, { AxiosResponse } from "axios";
import { createEffect } from "effector";
import { Song } from "./types";

const getMetadataAPI = async (name: string) => {
  return await externalAPI.get(`api/songs/metadata/${name}`, { withCredentials: false });
};

const getAllSongsAPI = async (params?: unknown) => {
  return await externalAPI.get("api/songs", { params: params ?? { take: 10 } });
};

const searchTrackAPI = async (params: unknown) => {
  return axios.get("http://localhost:3000/api/songs?name=" + params);
};

const searchTrackFx = createEffect<string, AxiosResponse<unknown>, Error>(searchTrackAPI);

const getOneSongAPI = async (id: number) => await externalAPI.get(`api/songs/${id}`);
const deleteOneSongAPI = async (id: number) => await externalAPI.delete(`api/songs/${id}`);

const saveSongAPI = async (song: Song & { image: File; music: File }) => {
  const formdata = new FormData();

  Object.entries(song).forEach(([key, value], _) =>
    formdata.append(key, value as unknown as string),
  );

  const response = await externalAPI.post("api/songs", formdata);

  return response;
};
const updateSongAPI = async ({ id, song }: { id: number; song: Song }) =>
  await externalAPI.patch(`/songs/${id}`, song);

const getMetadataFx = createEffect<string, AxiosResponse<unknown>, Error>(getMetadataAPI);

const getAllSongsFx = createEffect<unknown, AxiosResponse<TResponse<Song>>, Error>(getAllSongsAPI);

const saveSongFx = createEffect<Song & { image: File; music: File }, AxiosResponse<Song>, Error>(
  saveSongAPI,
);

const getOneSongFx = createEffect<number, AxiosResponse<Song>, Error>(getOneSongAPI);

const updateSongFx = createEffect<{ id: number; song: Song }, AxiosResponse<Song>, Error>(
  updateSongAPI,
);

const deleteOneSongFx = createEffect<number, AxiosResponse<Song>, Error>(deleteOneSongAPI);

const MusicAPI = {
  getAllSongsFx,
  saveSongFx,
  getOneSongFx,
  updateSongFx,
  deleteOneSongFx,
  getMetadataFx,
  searchTrackFx,
};

export { MusicAPI };

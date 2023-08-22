import axios from "axios";
import type { AxiosResponse } from "axios";
import { createEffect } from "effector";

import type { TResponse } from "@/types";
import { externalAPI } from "@/utils/axiosInstanse";

import type { TComment } from "../../comments/lib";
import type { Song } from "../model";

export const getMetadataAPI = async (name: string) => {
  return await externalAPI.get(`api/songs/metadata/${name}`, { withCredentials: false });
};

export const getAllSongsAPI = async () => {
  return await externalAPI.get("api/songs", { params: { take: 10 } });
};

export const searchTrackAPI = async (params: unknown) => {
  return axios.get("http://localhost:3000/api/songs?name=" + params);
};

export const getOneSongAPI = async (id: number) => await externalAPI.get(`api/songs/${id}`);

export const deleteOneSongAPI = async (id: number) => await externalAPI.delete(`api/songs/${id}`);

export const saveSongAPI = async (song: Song & { image: File; music: File }) => {
  const formdata = new FormData();

  Object.entries(song).forEach(([key, value]) => formdata.append(key, value as string));
  const response = await externalAPI.post("api/songs", formdata);

  return response;
};
export const updateSongAPI = async ({ id, song }: { id: number; song: Song }) =>
  await externalAPI.patch(`/songs/${id}`, song);

export const getTrackCommentsAPI = async (id: number) =>
  await externalAPI.get(`/songs/${id}/comments`);

export const searchTrackFx = createEffect<string, AxiosResponse<unknown>, Error>(searchTrackAPI);

export const getMetadataFx = createEffect<string, AxiosResponse<unknown>, Error>(getMetadataAPI);

export const getAllSongsFx = createEffect<unknown, AxiosResponse<TResponse<Song>>, Error>(
  getAllSongsAPI,
);

export const saveSongFx = createEffect<
  Song & { image: File; music: File },
  AxiosResponse<Song>,
  Error
>(saveSongAPI);

export const getOneSongFx = createEffect<number, AxiosResponse<Song>, Error>(getOneSongAPI);

export const updateSongFx = createEffect<{ id: number; song: Song }, AxiosResponse<Song>, Error>(
  updateSongAPI,
);

export const deleteOneSongFx = createEffect<number, AxiosResponse<Song>, Error>(deleteOneSongAPI);

export const getTrackCommentsFx = createEffect<number, AxiosResponse<TComment[]>, Error>(
  getTrackCommentsAPI,
);

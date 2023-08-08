import { AxiosResponse } from "axios";
import { createEffect } from "effector";

import { TResponse } from "@/types";

import {
  deleteOneSongAPI,
  getAllSongsAPI,
  getMetadataAPI,
  getOneSongAPI,
  getTrackCommentsAPI,
  saveSongAPI,
  searchTrackAPI,
  updateSongAPI,
} from "../api";
import { Song, TComment } from "../lib";

export const searchTrackFx = createEffect<string, AxiosResponse<any>, Error>(searchTrackAPI);

export const getMetadataFx = createEffect<string, AxiosResponse<any>, Error>(getMetadataAPI);

export const getAllSongsFx = createEffect<any, AxiosResponse<TResponse<Song>>, Error>(
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

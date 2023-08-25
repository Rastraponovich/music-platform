import { createEffect } from "effector";

import { Song } from "@/src/entity/songs/model";

import { externalRequest } from "../client";

export const songMetadataGetFx = createEffect<{ name: string }, unknown>(async ({ name }) => {
  const response = await externalRequest(`/api/songs/metadata/${name}`, "GET");

  return await response.json();
});

export const songsGetFx = createEffect<object, [Song[], number]>(async (params?: object) => {
  const body = new URLSearchParams();

  if (params) {
    Object.keys((param: string) => {
      // eslint-disable-next-line lines-around-comment, @typescript-eslint/ban-ts-comment
      //@ts-ignore
      //   body.append(param, String(params[param]) as string);

      body.set(param, String(params[param] as string));
    });
  } else {
    body.append("take", "10");
  }

  const response = await externalRequest(`/api/songs?take=10`, "GET");

  return await response.json();
});

export const songGetFx = createEffect<{ id: number }, Song>(async ({ id }) => {
  const response = await externalRequest(`/api/songs/${id}`, "GET");

  return await response.json();
});

export const songsSearchFx = createEffect<{ name: string }, [Song[], number]>(async ({ name }) => {
  const response = await externalRequest(`/api/songs?name=${name}`, "GET");

  return await response.json();
});

export const songDeleteFx = createEffect<{ id: number }, unknown>(async ({ id }) => {
  const response = await externalRequest(`/api/songs/${id}`, "DELETE");

  return await response.json();
});

export const songCreateFx = createEffect<{ song: Song; image: File; music: File }, Song>(
  async ({ song, image, music }) => {
    const formdata = new FormData();

    Object.entries(song).forEach(([key, value]) => formdata.append(key, value as string));
    formdata.append("image", image);
    formdata.append("music", music);

    const response = await externalRequest("/api/songs", "POST", song);

    return await response.json();
  },
);

export const songUpdateFx = createEffect<{ song: Song; id: number }, Song>(async ({ song, id }) => {
  const response = await externalRequest(`/api/songs/${id}`, "PUT", song);

  return await response.json();
});

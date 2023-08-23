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

export const songDeleteFx = createEffect<{ id: number }, unknown>(async ({ id }) => {
  const response = await externalRequest(`/api/songs/${id}`, "DELETE");

  return await response.json();
});

export const songCreateFx = createEffect<{ song: FormData }, Song>(async ({ song }) => {
  const response = await externalRequest("/api/songs", "POST", song);

  return await response.json();
});

export const songUpdateFx = createEffect<{ song: object; id: number }, Song>(
  async ({ song, id }) => {
    const response = await externalRequest(`/api/songs/${id}`, "PUT", song);

    return await response.json();
  },
);

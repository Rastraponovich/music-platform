import { attach, createEffect, createEvent, createStore, sample } from "effector";

import { api } from "~/shared/api";

export type TComment = {
  id: number;
  author: string;
  text: string;
  songId: number;
};

const commentSubmittedFx = createEffect<number, number, Error>();

const commentsGetFx = attach({
  effect: api.comments.commentsGetFx,
  mapParams: ({ id }) => ({ id }),
});

export const getComments = createEvent<number>();
export const commentSubmitted = createEvent<number>();
export const setNewComment = createEvent<{ id: string; text: string }>();

export const $comments = createStore<{ [key: number]: TComment[] }>({});

const $newComment = createStore<{ [key: number]: TComment }>({});

$comments.on(commentsGetFx.doneData, (comments, res) => {
  const trackId = res[0].songId;

  return { ...comments, [trackId]: res };
});

sample({
  clock: getComments,
  fn: (id) => ({ id }),
  target: commentsGetFx,
});

sample({
  clock: setNewComment,
  source: $newComment,
  fn: (comments, comment) => {
    const { id, text } = comment;

    return { ...comments, [id]: { ...comments[Number(id)], text } };
  },
  target: $newComment,
});

sample({
  clock: commentSubmitted,
  target: commentSubmittedFx,
});

sample({
  clock: commentSubmittedFx.doneData,

  source: $newComment,
  fn: (target, id) => {
    const { [id]: old, ...result } = target;

    return result;
  },
  target: $newComment,
});

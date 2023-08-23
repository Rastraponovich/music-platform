import { createEffect } from "effector";

import { TComment } from "@/src/entity/comments/lib";

export const commentsGetFx = createEffect<{ id: number }, TComment[]>(async ({ id }) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/api/songs/${id}/comments`);

  return await response.json();
});

import { createEvent, sample } from "effector";

import { songModel } from "@/src/entity/songs";

export const addTofavoritesButtonClicked = createEvent<number>();

sample({
  clock: addTofavoritesButtonClicked,
  target: songModel.actions.addToFavoriteButtonClicked,
});

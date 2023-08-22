import { createEvent, sample } from "effector";
import { songModel } from "~/entity/songs";

export const addTofavoritesButtonClicked = createEvent<number>();

sample({
  clock: addTofavoritesButtonClicked,
  target: songModel.addToFavoriteButtonClicked,
});

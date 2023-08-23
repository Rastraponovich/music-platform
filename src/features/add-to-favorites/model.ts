import { createEvent, sample } from "effector";
import { addToFavoriteButtonClicked } from "~/entity/songs";

export const addTofavoritesButtonClicked = createEvent<number>();

sample({
  clock: addTofavoritesButtonClicked,
  target: addToFavoriteButtonClicked,
});

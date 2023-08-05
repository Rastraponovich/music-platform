import { useUnit } from "effector-react";

import { addTofavoritesButtonClicked } from "../model";

import { HeartIcon } from "@heroicons/react/outline";
import { HeartIcon as Fav } from "@heroicons/react/solid";

/**
 * интерфейс для кнопки добавления в избранное
 *
 */
interface AddToFavoritesButtonProps {
  isFavorite: boolean;
  trackId: number;
}

export const AddToFavoritesButton = ({ trackId, isFavorite }: AddToFavoritesButtonProps) => {
  const handleAddToFavButtonClicked = useUnit(addTofavoritesButtonClicked);
  const onClick = () => handleAddToFavButtonClicked(trackId);

  return (
    <button onClick={onClick} title="добавить в избранное">
      {!isFavorite ? (
        <HeartIcon className=" h-5 w-6 text-gray-500 duration-200 group-hover:text-gray-900" />
      ) : (
        <Fav className=" h-5 w-6 text-gray-500 duration-200 group-hover:text-gray-900" />
      )}
    </button>
  );
};

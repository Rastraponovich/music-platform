import { PlusSmIcon } from "@heroicons/react/outline";
import { useUnit } from "effector-react";

import type { Song } from "@/src/entity/songs/lib";

import { addToPlaylistButtonClicked } from "./model";

/**
 * интерфейс кнопки добавления трека в плейлист
 * @param {Song} track
 */
interface AddToPlaylistButtonProps {
  track: Song;
}
export const AddToPlaylistButton = ({ track }: AddToPlaylistButtonProps) => {
  const handleButtonClicked = useUnit(addToPlaylistButtonClicked);

  const onClick = () => handleButtonClicked(track);

  return (
    <button onClick={onClick} title="добавить в плейлист winamp">
      <PlusSmIcon className="h-6 w-6 text-gray-500 duration-200 hover:animate-cross-spin hover:text-gray-900" />
    </button>
  );
};

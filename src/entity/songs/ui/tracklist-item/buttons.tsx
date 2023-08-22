import { memo } from "react";

import { AddToPlaylistButton } from "~/features/add-to-playlist";

import type { Song } from "../../model";

import { AnnotationIcon, HeartIcon, TrashIcon } from "@heroicons/react/outline";
import { HeartIcon as Fav } from "@heroicons/react/solid";

/**
 * base Interface
 */
interface ButtonProps {
  onClick(): void;
}

/**
 * интерфейс для кнопки добавления в избранное
 * @extends ButtonProps
 */
interface AddToFavoritesButtonProps extends ButtonProps {
  isFavorite: boolean;
}

const AddToFavoritesButton = ({ onClick, isFavorite }: AddToFavoritesButtonProps) => {
  // const styles = "h-5 w-6 text-gray-500 duration-200 group-hover:text-gray-900";

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

/**
 * интерфейс тоглера коментариев
 * @extends ButtonProps
 */
interface ToggleCommentsButtonProps extends ButtonProps {}

const ToggleCommentsButton = ({ onClick }: ToggleCommentsButtonProps) => {
  return (
    <button onClick={onClick} title="показать\скрыть комментарии">
      <TrashIcon className="h-5 w-6 text-gray-500 duration-200 group-hover:text-gray-900" />
    </button>
  );
};

/**
 * интерфейс тоглера коментариев
 * @extends ButtonProps
 */
interface ToggleCommentsButtonProps2 extends ButtonProps {
  commentsCount: number | undefined;
}

const ToggleCommentsButton2 = ({ onClick, commentsCount }: ToggleCommentsButtonProps2) => {
  return (
    <button className="group indicator" onClick={onClick} title="показать\скрыть комментарии">
      <span className="badge badge-xs indicator-item cursor-pointer border-gray-500 bg-gray-500 text-[10px] group-hover:border-gray-900 group-hover:bg-gray-900">
        {commentsCount}
      </span>
      <AnnotationIcon className="h-5 w-5 text-gray-500 duration-200 group-hover:text-gray-900" />
    </button>
  );
};

/**
 * интерфейс блока кнопок
 * @extends React.memo
 */
interface ActionsProps {
  track: Song;
  toggleComments(): void;
  addToFavorites(): void;
  isFavorite: boolean;
}

export const Actions = memo<ActionsProps>(
  ({ track, toggleComments, addToFavorites, isFavorite = false }) => {
    return (
      <div className="flex items-center justify-end space-x-1 justify-self-end">
        <AddToPlaylistButton track={track} />
        <ToggleCommentsButton2 onClick={toggleComments} commentsCount={track.comments.length} />
        <ToggleCommentsButton onClick={toggleComments} />
        <AddToFavoritesButton onClick={addToFavorites} isFavorite={isFavorite} />
      </div>
    );
  },
);

Actions.displayName = "Actions";

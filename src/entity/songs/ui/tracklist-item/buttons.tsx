import { HeartIcon as Fav } from "@heroicons/react/solid"
import { HeartIcon, TrashIcon, AnnotationIcon, PlusSmIcon } from "@heroicons/react/outline"
import { memo } from "react"
import { AddToPlaylistButton } from "@/src/features/add-to-playlist"
import { Song } from "../../lib"

/**
 * base Interface
 */
interface ButtonProps {
    onClick(): void
}

/**
 * интерфейс для кнопки добавления в избранное
 * @extends ButtonProps
 */
interface AddToFavoritesButtonProps extends ButtonProps {
    isFavorite: boolean
}

const AddToFavoritesButton = ({ onClick, isFavorite }: AddToFavoritesButtonProps) => {
    return (
        <button onClick={onClick} title="добавить в избранное">
            {!isFavorite ? (
                <HeartIcon className=" h-5 w-6 text-gray-500 duration-200 group-hover:text-gray-900" />
            ) : (
                <Fav className=" h-5 w-6 text-gray-500 duration-200 group-hover:text-gray-900" />
            )}
        </button>
    )
}

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
    )
}

/**
 * интерфейс тоглера коментариев
 * @extends ButtonProps
 */
interface ToggleCommentsButtonProps2 extends ButtonProps {
    commentsCount: number | undefined
}

const ToggleCommentsButton2 = ({ onClick, commentsCount }: ToggleCommentsButtonProps2) => {
    return (
        <button className="group indicator" onClick={onClick} title="показать\скрыть комментарии">
            <span className="badge indicator-item badge-sm cursor-pointer border-gray-500 bg-gray-500 group-hover:border-gray-900 group-hover:bg-gray-900">
                {commentsCount}
            </span>
            <AnnotationIcon className="h-6 w-6 text-gray-500 duration-200 group-hover:text-gray-900" />
        </button>
    )
}

/**
 * интерфейс блока кнопок
 * @extends React.memo
 */
interface ActionsProps {
    track: Song
    toggleComments(): void
    addToFavorites(): void
    isFavorite: boolean
}

export const Actions = memo(
    ({ track, toggleComments, addToFavorites, isFavorite = false }: ActionsProps) => {
        return (
            <div className="col-span-2 col-end-13 flex items-center justify-end space-x-2 justify-self-start">
                <AddToPlaylistButton track={track} />
                <ToggleCommentsButton2
                    onClick={toggleComments}
                    commentsCount={track.comments.length}
                />
                <ToggleCommentsButton onClick={toggleComments} />
                <AddToFavoritesButton onClick={addToFavorites} isFavorite={isFavorite} />
            </div>
        )
    }
)

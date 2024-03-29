import clsx from "clsx";
import { useList, useStoreMap, useUnit } from "effector-react";
import Image from "next/image";
import { memo, useCallback, useMemo, useState } from "react";
import { Comments } from "~/entity/comments";
import { $favoritesTracks, $songs, Song, addToFavoriteButtonClicked } from "~/entity/songs";
import { MEDIA_STATUS } from "~/entity/winamp";

import { convertTimeToString } from "@/utils/utils";

import { $currentTrack, $currentTrackDuration, $mediaStatus } from "~/widgets/winamp";

import { AddToPlaylistButton } from "~/features/add-to-playlist";
import { $currentTime, Progressbar } from "~/features/winamp/progress-bar";

import { $playedTime, playButtonClicked } from "./model";

import { AnnotationIcon, HeartIcon, TrashIcon } from "@heroicons/react/outline";
import { HeartIcon as Fav, PauseIcon, PlayIcon } from "@heroicons/react/solid";

export const Tracklist = () => {
  return (
    <div className="flex flex-col divide-y-2 divide-gray-200">
      {useList($songs, {
        getKey: (item) => item.id!,
        fn: (song) => <TrackListItem id={song.id} />,
      })}
    </div>
  );
};

interface TrackListItemProps {
  id: Song["id"];
}

//TODO: refactors
export const TrackListItem = memo<TrackListItemProps>(({ id }) => {
  const mediaStatus = useUnit($mediaStatus);

  const { track, duration } = useStoreMap({
    store: $songs,
    keys: [id],
    fn: (songs) => {
      const track = songs.find((song) => song.id === id);
      const duration = convertTimeToString(track!.metaData?.format.duration);

      return { track, duration };
    },
  }) as {
    track: Song;
    duration: string;
  };

  const isFavorite = useStoreMap({
    store: $favoritesTracks,
    keys: [id],
    fn: (favorites) => favorites.some((favorite) => favorite === track?.id),
  });

  const isCurrentPlayedTrack = useStoreMap({
    store: $currentTrack,
    keys: [id],
    fn: (currentTrack) => currentTrack?.id === id,
  });

  const handleAddToFavButtonClicked = useUnit(addToFavoriteButtonClicked);

  const onPlay = useUnit(playButtonClicked);

  const handlePlayTrack = useCallback(() => {
    onPlay(track);
  }, [onPlay, track]);

  const [comments, showComments] = useState(false);

  const toggleComments = useCallback(() => showComments((prev) => !prev), []);

  const handleAddToFavorites = useCallback(() => {
    handleAddToFavButtonClicked(id);
  }, [handleAddToFavButtonClicked, id]);

  const needToShow = useMemo(() => {
    return isCurrentPlayedTrack && mediaStatus !== MEDIA_STATUS.STOPPED;
  }, [isCurrentPlayedTrack, mediaStatus]);

  return (
    <div className="relative flex flex-col overflow-hidden shadow-sm">
      <div
        className={clsx(
          "z-20 grid grid-cols-[32px_40px_3fr_minmax(0,130px)] items-center rounded bg-white p-2 text-sm md:text-base",
          comments && "drop-shadow-xl",
          isCurrentPlayedTrack && "bg-orange-300",
        )}
      >
        <PlayButton onClick={handlePlayTrack} isCurrentTrack={isCurrentPlayedTrack} />
        <div className="col-span-1 flex items-center">
          <Image
            src={`${process.env.NEXT_PUBLIC_BACKEND}/images/${track.cover}`}
            objectFit="contain"
            height={40}
            width={40}
            alt={`${track.artist} ${track.name}`}
          />
        </div>
        <div className="col-span-1 flex h-full grow flex-col items-stretch justify-start truncate px-2">
          <span className=" truncate font-normal text-gray-800 ">
            {track.artist.trim()}&nbsp;
            <b className=" font-semibold before:content-['–']">&nbsp;{track.name.trim()}</b>
          </span>
          {needToShow && <Progressbar />}
        </div>

        <div className="col-span-1 mr-2 flex h-full flex-col items-end justify-self-end text-xs text-gray-800 md:text-sm">
          <div className="flex">
            {needToShow && <TrackTimer />}

            <span>{duration}</span>
          </div>
          <Actions
            isFavorite={isFavorite}
            track={track}
            toggleComments={toggleComments}
            addToFavorites={handleAddToFavorites}
          />
        </div>
      </div>
      <Comments opened={comments} trackId={id!} />
    </div>
  );
});

TrackListItem.displayName = "TrackListItem";

interface PlayButtonProps {
  isCurrentTrack: boolean;
  onClick(): void;
}

const PlayButton = memo<PlayButtonProps>(({ isCurrentTrack, onClick }) => {
  const mediaStatus = useUnit($mediaStatus);

  return (
    <button
      onClick={onClick}
      className={clsx(
        "col-span-1 justify-self-center text-gray-500 duration-150 hover:text-gray-900",
        isCurrentTrack &&
          mediaStatus === "PLAYING" &&
          "animate-pulse text-gray-900 hover:animate-none",
      )}
      title="play/pause"
    >
      {isCurrentTrack && mediaStatus === "PLAYING" ? (
        <PauseIcon className="h-8 w-8" />
      ) : (
        <PlayIcon className="h-8 w-8" />
      )}
    </button>
  );
});

PlayButton.displayName = "PlayButton";

interface ButtonProps {
  onClick(): void;
}

interface AddToFavoritesButtonProps extends ButtonProps {
  isFavorite: boolean;
}

const AddToFavoritesButton = memo<AddToFavoritesButtonProps>(({ onClick, isFavorite }) => {
  return (
    <button onClick={onClick} title="добавить в избранное">
      {!isFavorite ? (
        <HeartIcon className=" h-5 w-6 text-gray-500 duration-200 group-hover:text-gray-900" />
      ) : (
        <Fav className=" h-5 w-6 text-gray-500 duration-200 group-hover:text-gray-900" />
      )}
    </button>
  );
});

AddToFavoritesButton.displayName = "AddToFavoritesButton";

interface ToggleCommentsButtonProps extends ButtonProps {}

const ToggleCommentsButton = ({ onClick }: ToggleCommentsButtonProps) => {
  return (
    <button onClick={onClick} title="показать\скрыть комментарии">
      <TrashIcon className="h-5 w-6 text-gray-500 duration-200 group-hover:text-gray-900" />
    </button>
  );
};

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

interface TrackListSmallItemProps {
  id: Song["id"];
}

export const TrackListItemSmall = memo<TrackListSmallItemProps>(({ id }) => {
  const { track, duration } = useStoreMap({
    store: $songs,
    keys: [id],
    fn: (songs) => {
      const track = songs.find((song) => song.id === id);
      const duration = convertTimeToString(track!.metaData?.format.duration);

      return { track, duration };
    },
  }) as {
    track: Song;
    duration: string;
  };

  const isCurrentTrack = useStoreMap({
    store: $currentTrack,
    keys: [id],
    fn: (currentTrack) => currentTrack?.id === id,
  });

  const [currentTrackDuration, currentTrackTime, mediaStatus] = useUnit([
    $currentTrackDuration,
    $currentTime,
    $mediaStatus,
  ]);

  const onPlay = useUnit(playButtonClicked);

  const handlePlayTrack = useCallback(() => {
    onPlay(track);
  }, [onPlay, track]);

  const needToShow = useMemo(() => {
    return isCurrentTrack && mediaStatus !== MEDIA_STATUS.STOPPED;
  }, [isCurrentTrack, mediaStatus]);

  return (
    <div
      className={clsx(
        "group relative flex flex-col overflow-hidden shadow-sm duration-200",
        isCurrentTrack && "my-2 drop-shadow-xl",
      )}
    >
      {needToShow && (
        <progress
          className="progress-primary  h-0.5 w-full"
          value={currentTrackTime}
          max={currentTrackDuration}
        ></progress>
      )}

      <div className="z-20 grid grid-cols-12 items-center rounded bg-white py-2 px-1 group-hover:bg-gray-200 md:pr-2">
        <button
          onClick={handlePlayTrack}
          className={clsx(
            "col-span-1 justify-self-start text-gray-500 duration-150 hover:text-gray-900 md:justify-self-center",
            isCurrentTrack &&
              mediaStatus === "PLAYING" &&
              "animate-pulse text-gray-900 hover:animate-none",
          )}
          title="play/pause"
        >
          {isCurrentTrack && mediaStatus === "PLAYING" ? (
            <PauseIcon className="h-6 w-6 md:h-10 md:w-10" />
          ) : (
            <PlayIcon className="h-6 w-6 md:h-10 md:w-10" />
          )}
        </button>
        <div className="col-span-8 flex items-center space-x-2 md:col-span-10">
          <div className="relative  h-5 w-5 md:h-10 md:w-10">
            <Image
              src={`${process.env.NEXT_PUBLIC_BACKEND}/images/${track.cover}`}
              objectFit="contain"
              alt={`${track.artist} ${track.name}`}
              layout="fill"
            />
          </div>

          <div className=" flex grow flex-col justify-center text-xs md:flex-row md:justify-start md:text-base">
            <span className=" font-normal text-gray-800 after:mx-2 md:after:content-['-']">
              {track.artist}
            </span>
            <span className=" truncate font-semibold">{track.name}</span>
          </div>
        </div>
        <div className="col-span-1 col-start-12  flex flex-col justify-self-end text-xs text-gray-800 md:col-start-13 md:flex-row md:text-sm">
          {needToShow && <TrackTimer />}

          <span>{duration}</span>
        </div>
      </div>
    </div>
  );
});

TrackListItemSmall.displayName = "TrackListItemSmall";

//TODO: refactor
const TrackTimer = () => {
  const playedTimeString = useUnit($playedTime);

  return (
    <span className="after:mx-1 md:after:content-['/']" title={playedTimeString}>
      {playedTimeString}
    </span>
  );
};

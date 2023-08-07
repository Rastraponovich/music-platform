import clsx from "clsx";
import Image from "next/image";
import { useList, useUnit } from "effector-react";
import { memo, useState, useMemo, useCallback } from "react";

import { MEDIA_STATUS } from "@/features/media/constants";
import { winamp, winampControls } from "@/src/widgets/winamp/model";

import { Comments } from "@/src/entity/comments";
import { TrackTimer } from "@/components/track-timer";
import { convertTimeToObj } from "@/utils/utils";

import { PauseIcon, PlayIcon } from "@heroicons/react/solid";
import { songLib } from "../..";
import { $songs, actions, selectors } from "../../model";
import { Actions } from "./buttons";
import { Track } from "@/features/music/types";
import { Progressbar } from "@/src/features/winamp/progress-bar";

/**
 * интерфейс TrackListItem
 */
interface TrackListItemProps {
  track: songLib.Song;
  isCurrentTrack: boolean;
}

/**
 * ui Трека из списка треков
 * @param {boolean} isCurrentTrack
 * @param {track} songLib.Song
 */
export const TrackListItem = memo(({ track, isCurrentTrack }: TrackListItemProps) => {
  const mediaStatus = useUnit(winamp.$mediaStatus);
  const isFavorite = selectors.useFavoriteTrack(track?.id) || false;
  const handleAddToFavButtonClicked = useUnit(actions.addToFavoriteButtonClicked);

  const { firstMinute, lastSecond, lastMinute, firstSecond } = useMemo(
    () => convertTimeToObj(track?.metaData?.format.duration),
    [track],
  );

  const [handleSelectTrack, handlePlay, handlePause] = useUnit([
    winamp.selectTrackFromList,
    winampControls.play,
    winampControls.pause,
  ]);

  const play = useCallback(() => {
    switch (true) {
      case !isCurrentTrack:
        return handleSelectTrack(track);

      case mediaStatus === "PLAYING":
        return handlePause();

      default:
        return handlePlay();
    }
  }, [handlePause, handlePlay, handleSelectTrack, isCurrentTrack, mediaStatus, track]);

  const [comments, showComments] = useState(false);

  const toggleComments = useCallback(() => showComments((prev) => !prev), []);

  const handleAddToFavorites = () => {
    handleAddToFavButtonClicked(track!.id);
  };

  const needToShow = isCurrentTrack && mediaStatus !== MEDIA_STATUS.STOPPED;

  return (
    <div className="relative flex flex-col overflow-hidden shadow-sm">
      <div
        className={clsx(
          "z-20 grid grid-cols-[32px_40px_3fr_minmax(0,130px)] items-center rounded bg-white p-2 text-sm md:text-base",
          comments && "drop-shadow-xl",
          isCurrentTrack && "bg-orange-300",
        )}
      >
        <PlayButton onClick={play} isCurrentTrack={isCurrentTrack} />
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

            <span>
              {firstMinute}
              {lastMinute}:{firstSecond}
              {lastSecond}
            </span>
          </div>
          <Actions
            isFavorite={isFavorite}
            track={track}
            toggleComments={toggleComments}
            addToFavorites={handleAddToFavorites}
          />
        </div>
      </div>
      <Comments opened={comments} trackId={track.id!} />
    </div>
  );
});

TrackListItem.displayName = "TrackListItem";

export const Tracklist = () => {
  const currentTrack = useUnit(winamp.$currentTrack) as Track;
  const countSongs = selectors.useCountSongs();

  return (
    <div className="flex  flex-col divide-y-2 divide-gray-200">
      {useList($songs, {
        keys: [currentTrack, countSongs],
        fn: (song) => <TrackListItem track={song} isCurrentTrack={currentTrack?.id === song.id} />,
      })}
    </div>
  );
};

interface PlayButtonProps {
  isCurrentTrack: boolean;
  onClick(): void;
}

const PlayButton = memo(({ isCurrentTrack, onClick }: PlayButtonProps) => {
  const mediaStatus = useUnit(winamp.$mediaStatus);

  return (
    <button
      onClick={onClick}
      className={clsx(
        "col-span-1 justify-self-center text-gray-500 duration-150 hover:text-black",
        isCurrentTrack &&
          mediaStatus === "PLAYING" &&
          "animate-pulse  text-black hover:animate-none",
      )}
      title="play/pause"
    >
      {isCurrentTrack ? (
        mediaStatus === "PLAYING" ? (
          <PauseIcon className="h-8 w-8" />
        ) : (
          <PlayIcon className="h-8 w-8" />
        )
      ) : (
        <PlayIcon className="h-8 w-8" />
      )}
    </button>
  );
});

PlayButton.displayName = "PlayButton";

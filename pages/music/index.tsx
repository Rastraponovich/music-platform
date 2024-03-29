import clsx from "clsx";
import { allSettled, fork, serialize } from "effector";
import { useUnit } from "effector-react";
import type { GetServerSideProps, NextPage } from "next";
import { useState } from "react";
import { $songsCount, songsGet } from "~/entity/songs";

import { MusicFilter } from "@/src/features/music-page/music-filter";
import { UploadFormModal } from "@/src/features/music-page/upload-form";

import { Tracklist } from "~/widgets/tracklist";
import { playAllTracksFromList, showWinamp } from "~/widgets/winamp";

import { SearchInput } from "~/features/music-page/search-input";
import { PlaylistFormModal } from "~/features/playlists/create-playlist-form";

import { WinampIcon } from "~/shared/ui/winamp-icon";

import { MusicNoteIcon, PlayIcon } from "@heroicons/react/solid";

const MusicPage: NextPage = () => {
  const [handleShowWinamp, hanldePlayAll] = useUnit([showWinamp, playAllTracksFromList]);

  const [activePage, setActivePage] = useState<Nullable<number>>(null);

  const countSongs = useUnit($songsCount);

  return (
    <main className="grow px-20 py-10">
      <SearchInput />
      <MusicFilter />

      <div className="flex justify-start space-x-2">
        <button
          onClick={handleShowWinamp}
          title="открыть winamp"
          className="btn btn-square no-animation btn-xs hover:shadow-lg"
        >
          <WinampIcon size="extraSmall" />
        </button>
        <button
          onClick={hanldePlayAll}
          title="воспроизвести все треки"
          className="btn no-animation btn-xs gap-2  hover:shadow-lg"
        >
          <PlayIcon className="h-4 w-4" />
          play all tracks
        </button>
        <PlaylistFormModal />

        <div className="grow"></div>
        <UploadFormModal />
      </div>

      <section className="flex flex-col py-4">
        <div className="mb-2 flex items-center self-end text-right text-sm">
          <MusicNoteIcon className="mr-2 h-4 w-4 rounded-full bg-black p-1 text-white" />
          <span className="mb-1">всего треков: {countSongs}</span>
        </div>
        <Tracklist />
      </section>

      <div className="btn-group items-center justify-center">
        <button
          className={clsx("btn btn-sm", activePage === 1 && "btn-active")}
          onClick={() => setActivePage(1)}
        >
          1
        </button>
        <button
          className={clsx("btn btn-sm", activePage === 2 && "btn-active")}
          onClick={() => setActivePage(2)}
        >
          2
        </button>
        <button
          className={clsx("btn btn-sm", activePage === 3 && "btn-active")}
          onClick={() => setActivePage(3)}
        >
          3
        </button>
        <button
          className={clsx("btn btn-sm", activePage === 4 && "btn-active")}
          onClick={() => setActivePage(4)}
        >
          4
        </button>
      </div>
    </main>
  );
};

export default MusicPage;

export const getServerSideProps: GetServerSideProps = async () => {
  const scope = fork();

  await allSettled(songsGet, { scope });

  return {
    props: {
      initialState: serialize(scope),
    },
  };
};

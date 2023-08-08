import { MusicNoteIcon, PlayIcon } from "@heroicons/react/solid";
import clsx from "clsx";
import { allSettled, fork, serialize } from "effector";
import { useUnit } from "effector-react";
import type { GetServerSideProps, NextPage } from "next";
import { useState } from "react";

import { MusicFilter } from "@/components/music-filter";
import { PlaylistFormModal } from "@/components/playlist-form";
import { SearchInput } from "@/components/search-input";
import { UploadFormModal } from "@/components/upload-form";
import { Tracklist, songModel } from "@/src/entity/songs";
import { winamp } from "@/src/widgets/winamp/model";

import { WinampIcon } from "~/shared/ui/winamp-icon";

const MusicPage: NextPage = () => {
  const hanldePlayAll = useUnit(winamp.playAllTracksFromList);

  const [activePage, setActivePage] = useState<Nullable<number>>(null);

  const handleShowWinamp = useUnit(winamp.show);

  const countSongs = songModel.selectors.useCountSongs();

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

  await allSettled(songModel.actions.getSongs, { scope });

  return {
    props: {
      initialState: serialize(scope),
    },
  };
};

import { fork, serialize } from "effector";
import { useList } from "effector-react";
import type { GetServerSideProps, NextPage } from "next";
import Image from "next/image";
import { ALBUMS, Album, AlbumInfo } from "~/entity/albums";
import { $songs } from "~/entity/songs";

import { TrackListItem } from "~/widgets/tracklist";

import { PlaylistFormModal } from "~/features/playlists/create-playlist-form";

import { Rating } from "~/shared/ui/rating";

interface PlaylistPageProps {
  playlist: Album;
}

const albumInfo = {
  createdDate: "01.03.2022",
  tracks: 10,
  genre: "rock",
  duration: "01:45:00",
  rating: 5,
  author: "wilde",
};

const PlaylistPage: NextPage<PlaylistPageProps> = ({ playlist }) => {
  return (
    <main className="grow space-y-4 px-20 pb-5 pt-1">
      <h2 className="text-2xl font-semibold">Плейлист</h2>
      <div className="flex">
        <PlaylistFormModal />
      </div>

      <section>
        <h2 className="mb-4 text-base font-bold">{playlist.title}</h2>
        <div className="grid grid-cols-12 items-start gap-4">
          <div className="col-span-7 flex  flex-col rounded bg-white">
            <h4>Список треков</h4>
            <div className="flex flex-col">
              {useList($songs, {
                keys: [$songs.map((item) => item.length)],
                getKey: (item) => item.id!,
                fn: (song) => <TrackListItem id={song.id!} />,
                placeholder: (
                  <span className="text-base font-light italic text-gray-500 ">Пусто</span>
                ),
              })}
            </div>
          </div>
          <AlbumInfo albumProps={albumInfo} />
          <div className="col-span-2 col-end-13 flex flex-col items-center space-y-2">
            <Image
              src={`/images/${playlist.backgroundImage}`}
              alt={"album-cover"}
              height={160}
              width={160}
            />
            <Rating value={albumInfo.rating} />
          </div>
        </div>
      </section>
    </main>
  );
};

export default PlaylistPage;

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const scope = fork();

  const playlist = ALBUMS.find((item) => item.id === Number(params!.id));

  // await allSettled(getPlaylists, { scope })

  return {
    props: {
      initialState: serialize(scope),
      playlist,
    },
  };
};

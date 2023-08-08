import { fork, serialize } from "effector";
import { useList } from "effector-react";
import { GetServerSideProps, NextPage } from "next";

import Album from "@/components/Albums/Album/Album";
import PlaylistFormModal from "@/components/playlist-form/playlist-form-modal";
import { $playlists } from "@/features/playlist";
import { albums } from "@/utils/__mock__";

const PlaylistPage: NextPage = () => {
  return (
    <main className="grow space-y-4 px-5 pb-5 pt-1 sm:px-10 md:px-20">
      <h2 className="text-2xl font-semibold">Плейлисты</h2>
      <div className="flex">
        <PlaylistFormModal />
      </div>
      <section className="grid grid-cols-3 content-start gap-4 py-5">
        {albums.map((item) => (
          <Album album={item} key={item.id} />
        ))}
      </section>

      <section className="grid grid-cols-3 gap-4">
        {useList($playlists, { fn: (pl) => <div>{pl.name}</div> })}
      </section>
    </main>
  );
};

export default PlaylistPage;

export const getServerSideProps: GetServerSideProps = async () => {
  const scope = fork();

  // await allSettled(getPlaylists, { scope })

  return {
    props: {
      initialState: serialize(scope),
    },
  };
};

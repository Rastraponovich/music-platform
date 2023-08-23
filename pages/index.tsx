import type { NextPage } from "next";
import Image from "next/image";
import { ALBUMSList } from "~/entity/albums";

import { Tarifs } from "@/components/tarifs";

// import { getPlaylists } from "@/features/playlist"
// import { allSettled, fork, serialize } from "effector"

const Home: NextPage = () => {
  return (
    <main className="grow ">
      <section className=" flex h-[calc(100vh-200px)] max-h-[90vh] flex-col items-center  justify-center bg-hero-pattern bg-cover px-20 py-10">
        <h2 className="mb-10 text-[55px] font-bold text-blue-300 drop-shadow-lg">
          <q lang="ru">БДЫЩ</q>
        </h2>
        <p className="prose text-2xl text-white drop-shadow-lg">уникальный плейлист уже доступен</p>
      </section>
      <section className="flex flex-col bg-white px-5 py-10 sm:px-10 md:px-20">
        <h2 className="mb-4 text-3xl font-bold">Новинки</h2>
        <ALBUMSList />
      </section>

      <section className="grid grid-cols-3 items-center bg-blue-600 px-5 text-white sm:grid-cols-2 sm:px-10 md:grid-cols-3 md:px-20">
        <div className=" -mt-4 -mb-6">
          <Image
            src="/images/subscribe.jpg"
            height={160}
            width={160}
            alt="subscribe"
            className=" rounded-full"
          />
        </div>

        <div className="flex flex-col items-center self-center sm:col-span-1 md:col-span-2">
          <h3 className="italic ">
            <q lang="ru" className="first-letter:uppercase">
              экспертное мнение
            </q>
          </h3>
          <h2 className="text-3xl font-extrabold first-letter:uppercase">подпишись, П*дрила</h2>
        </div>
      </section>

      <Tarifs />
    </main>
  );
};

export default Home;

// export const getServerSideProps: GetServerSideProps = async () => {
//     const scope = fork()

//     await allSettled(getPlaylists, { scope })

//     return {
//         props: {
//             initialState: serialize(scope),
//         },
//     }
// }

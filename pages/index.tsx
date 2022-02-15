import Layout from "@/components/ui/Layout/Layout"
import { $songs, getSongs } from "@/features/music"
import {
    $currentPlaylist,
    $playlists,
    changePlaylist,
    getPlaylists,
    submitted,
} from "@/features/playlist"
import { allSettled, fork, serialize } from "effector"
import { useEvent, useStore } from "effector-react"
import type { GetServerSideProps, NextPage } from "next"
import Head from "next/head"
import Image from "next/image"
import Link from "next/link"

const Home: NextPage = () => {
    const currentPlaylist = useStore($currentPlaylist)

    const playlists = useStore($playlists)

    const handleChange = useEvent(changePlaylist)

    const onSubmit = useEvent(submitted)
    return (
        <main className="grow ">
            <section className=" h-[calc(100vh-200px)] max-h-[90vh] bg-hero-pattern bg-contain ">
                <div className="flex h-full flex-col items-center justify-center bg-white/10 px-20 py-10 backdrop-blur-sm backdrop-brightness-50">
                    <h2 className="mb-10 text-[55px] font-bold text-blue-300 ">
                        <q lang="ru">БДЫЩ</q>
                    </h2>
                    <p className="prose text-2xl text-white">уникальный плейлист уже доступен</p>
                </div>
            </section>
            <section className="flex flex-col bg-white px-20 py-10">
                <h2 className="mb-4 text-3xl font-bold">Новинки</h2>
                <div className="grid grid-cols-2 items-center gap-4">
                    <article className="flex flex-col space-y-3 rounded-md p-3 shadow-lg hover:shadow-xl">
                        <div className="h-[100px]  bg-orange-500"></div>
                        <h3 className="text-xl font-semibold first-letter:uppercase">Ядрена вощ</h3>
                        <p className="text-sm font-normal">новый альбом</p>
                        <Link href="/">
                            <a className="self-start rounded bg-violet-500 px-4 py-2 text-base font-normal uppercase text-white">
                                перейти
                            </a>
                        </Link>
                    </article>
                    <article className="flex flex-col space-y-3 rounded-md p-3 shadow-lg hover:shadow-xl">
                        <div className="h-[100px]  bg-orange-500"></div>
                        <h3 className="text-xl font-semibold first-letter:uppercase">куда преш</h3>
                        <p className="text-sm font-normal">новый альбом</p>
                        <Link href="/">
                            <a className="self-start rounded bg-violet-500 px-4 py-2 text-base font-normal uppercase text-white">
                                перейти
                            </a>
                        </Link>
                    </article>
                    <article className="flex flex-col space-y-3 rounded-md p-3 shadow-lg hover:shadow-xl">
                        <div className="h-[100px]  bg-orange-500"></div>
                        <h3 className="text-xl font-semibold first-letter:uppercase">
                            тапки в тряпки
                        </h3>
                        <p className="text-sm font-normal">новый альбом</p>
                        <Link href="/">
                            <a className="self-start rounded bg-violet-500 px-4 py-2 text-base font-normal uppercase text-white">
                                перейти
                            </a>
                        </Link>
                    </article>
                    <article className="flex flex-col space-y-3 rounded-md p-3 shadow-lg hover:shadow-xl">
                        <div className="h-[100px]  bg-orange-500"></div>
                        <h3 className="text-xl font-semibold first-letter:uppercase">
                            крути меня мошпит
                        </h3>
                        <p className="text-sm font-normal">новый альбом</p>
                        <Link href="/">
                            <a className="self-start rounded bg-violet-500 px-4 py-2 text-base font-normal uppercase text-white">
                                перейти
                            </a>
                        </Link>
                    </article>
                </div>
            </section>

            <section className="flex flex-col items-center justify-center bg-transparent px-20 py-10">
                <h2 className="text-3xl font-extrabold first-letter:uppercase">А ты подписался?</h2>
            </section>

            <section className="flex flex-col  bg-white px-20 py-10">
                <h2 className="mb-4 text-3xl font-bold first-letter:uppercase">тарифы</h2>
                <div className="grid grid-cols-3 gap-4">
                    <div className="flex flex-col justify-between space-y-4 rounded bg-blue-400 p-4 shadow-lg">
                        <h3 className="text-2xl font-normal">пидор</h3>
                        <p className="grow">ты просто пидор</p>
                        <span className="text-2xl font-bold">$40</span>
                        <button className="rounded bg-slate-400 px-4 py-2">стать пидором</button>
                    </div>

                    <div className="flex flex-col justify-between space-y-4 rounded bg-yellow-400 p-4 shadow-lg">
                        <h3 className="text-2xl font-normal">пидор классический</h3>
                        <p className="grow">ты еще просто пидор но в туфлях</p>
                        <span className="text-2xl font-bold">$80</span>
                        <button className="rounded bg-slate-400 px-4 py-2">стать пидором</button>
                    </div>
                    <div className="flex flex-col justify-between space-y-4 rounded bg-green-400 p-4 shadow-lg">
                        <h3 className="text-2xl font-normal">супер пидор</h3>
                        <p className="grow">все пидорские возможности и не только</p>
                        <span className="text-2xl font-bold">$120</span>
                        <button className="rounded bg-slate-400 px-4 py-2">стать пидором</button>
                    </div>
                </div>
            </section>
            <section className="flex flex-col bg-slate-200 px-20 py-10">
                <h4>Новый плейлист</h4>
                <form className="flex flex-col" onSubmit={onSubmit}>
                    <input
                        type="text"
                        value={currentPlaylist.name}
                        onChange={handleChange}
                        name="name"
                    />

                    <button type="submit">сохранить</button>
                </form>
            </section>
        </main>
    )
}

export default Home

// export const getServerSideProps: GetServerSideProps = async () => {
//     const scope = fork()

//     await allSettled(getPlaylists, { scope })

//     return {
//         props: {
//             initialState: serialize(scope),
//         },
//     }
// }

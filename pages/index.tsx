import Layout from "@/components/ui/Layout/Layout"
import { fork, serialize } from "effector"
import type { GetServerSideProps, NextPage } from "next"
import Head from "next/head"
import Image from "next/image"
import Link from "next/link"

const Home: NextPage = () => {
    return (
        <Layout title="Главная">
            <main className="grow ">
                <section className="flex flex-col items-center justify-center px-20 py-10">
                    <h2 className="mb-10 text-3xl font-bold text-blue-300">БДЫЩ</h2>
                    <p className="prose ">уникальный плейлист уже доступен</p>
                </section>
                <section className="flex flex-col bg-white px-20 py-10">
                    <h2 className="mb-4 text-3xl font-bold">Новинки</h2>
                    <div className="grid grid-cols-2 items-center gap-4">
                        <article className="flex flex-col space-y-3 rounded-md p-3 shadow-lg hover:shadow-xl">
                            <div className="h-[100px]  bg-orange-500"></div>
                            <h3 className="text-xl font-semibold first-letter:uppercase">
                                Ядрена вощ
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
                                куда преш
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
                    <h2 className="text-3xl font-extrabold first-letter:uppercase">
                        А ты подписался?
                    </h2>
                </section>

                <section className="flex flex-col  bg-white px-20 py-10">
                    <h2 className="mb-4 text-3xl font-bold first-letter:uppercase">тарифы</h2>
                    <div className="grid grid-cols-3 gap-4">
                        <div className="flex flex-col justify-between space-y-4 rounded bg-blue-400 p-4 shadow-lg">
                            <h3 className="text-2xl font-normal">пидор</h3>
                            <p className="grow">ты просто пидор</p>
                            <span className="text-2xl font-bold">$40</span>
                            <button className="rounded bg-slate-400 px-4 py-2">Будь пидором</button>
                        </div>

                        <div className="flex flex-col justify-between space-y-4 rounded bg-yellow-400 p-4 shadow-lg">
                            <h3 className="text-2xl font-normal">пидор классический</h3>
                            <p className="grow">ты еще просто пидор но в туфлях</p>
                            <span className="text-2xl font-bold">$80</span>
                            <button className="rounded bg-slate-400 px-4 py-2">Будь пидором</button>
                        </div>
                        <div className="flex flex-col justify-between space-y-4 rounded bg-green-400 p-4 shadow-lg">
                            <h3 className="text-2xl font-normal">супер пидор</h3>
                            <p className="grow">все пидорские возможности и не только</p>
                            <span className="text-2xl font-bold">$120</span>
                            <button className="rounded bg-slate-400 px-4 py-2">Будь пидором</button>
                        </div>
                    </div>
                </section>
            </main>
        </Layout>
    )
}

export default Home

export const getServerSideProps: GetServerSideProps = async () => {
    const scpoe = fork()

    return {
        props: {
            initialState: serialize(scpoe),
        },
    }
}

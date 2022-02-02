import clsx from "clsx"
import { FC } from "react"
import Image from "next/image"
import dynamic from "next/dynamic"
import { GetServerSideProps } from "next"
import { allSettled, fork, serialize } from "effector"
import { useEvent, useList, useStore } from "effector-react"

import {
    $currentSong,
    $files,
    $songs,
    changeSong,
    getSongs,
    submitted,
    uploadFile,
} from "@/features/music"

import Layout from "@/components/ui/Layout/Layout"

const AudioPlayer = dynamic(() => import("@/components/ui/AudioPlayer/AudioPlayer"), {
    ssr: false,
})

interface MusicPageProps {}

const MusicPage: FC<MusicPageProps> = () => {
    const songs = useStore($songs)

    const currentSong = useStore($currentSong)

    const files = useStore($files)
    const onUpload = useEvent(uploadFile)

    const onSubmit = useEvent(submitted)

    const onChange = useEvent(changeSong)

    return (
        <Layout title="Плейлисты">
            <main className="grow">
                <h2>добро пожаловать</h2>

                <section className="grid grid-cols-1 gap-4 px-20 py-10 lg:grid-cols-3">
                    {useList($songs, {
                        fn: (song) => (
                            <div className="flex flex-col space-y-4">
                                <div
                                    className={clsx(
                                        "relative flex h-[200px] grow backdrop-blur-sm ",
                                        "bg-gradient-to-r from-cyan-500 to-blue-500"
                                    )}
                                >
                                    <Image
                                        src={`${process.env.NEXT_PUBLIC_BACKEND}/images/${song.cover}`}
                                        objectFit="contain"
                                        layout="fill"
                                        placeholder="blur"
                                        blurDataURL={`${process.env.NEXT_PUBLIC_BACKEND}/images/${song.cover}`}
                                        loading="lazy"
                                    />
                                </div>
                                <h3>исполнитель: {song.artist}</h3>
                                <h4>Название: {song.name}</h4>
                                <AudioPlayer track={song} />
                            </div>
                        ),
                    })}
                </section>

                <section className="flex px-20 py-10">
                    <form className="flex flex-col space-y-4" onSubmit={onSubmit}>
                        <input
                            type="text"
                            name="name"
                            value={currentSong.name}
                            onChange={onChange}
                        />
                        <input
                            type="text"
                            name="artist"
                            value={currentSong.artist}
                            onChange={onChange}
                        />
                        <span>image</span>
                        <input type="file" name="image" onChange={onUpload} />
                        <span>music</span>

                        <input type="file" name="music" onChange={onUpload} />
                        <button type="submit">Сохранить</button>
                    </form>
                </section>
            </main>
        </Layout>
    )
}

export default MusicPage

export const getServerSideProps: GetServerSideProps = async () => {
    const scope = fork()

    await allSettled(getSongs, { scope })

    return {
        props: {
            initialState: serialize(scope),
        },
    }
}

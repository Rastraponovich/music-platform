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
import TrackListItem from "@/components/TrackListItem/TrackListItem"

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
            <main className="grow px-20 py-10">
                <h2>добро пожаловать</h2>

                <section className="flex flex-col">
                    <div className="flex  flex-col divide-y-2 divide-gray-200">
                        {useList($songs, {
                            fn: (song) => <TrackListItem track={song} />,
                        })}
                    </div>
                </section>

                <section className="flex px-20 py-10">
                    <form className="flex flex-col space-y-4" onSubmit={onSubmit}>
                        <label className="flex flex-col">
                            <span>Название</span>
                            <input
                                type="text"
                                name="name"
                                value={currentSong.name}
                                onChange={onChange}
                            />
                        </label>

                        <label className="flex flex-col">
                            <span>Автор</span>
                            <input
                                type="text"
                                name="artist"
                                value={currentSong.artist}
                                onChange={onChange}
                            />
                        </label>

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

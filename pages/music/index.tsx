import { FC } from "react"
import { GetServerSideProps } from "next"
import { allSettled, fork, serialize } from "effector"
import { useEvent, useList, useStore } from "effector-react"

import { $currentSong, $songs, changeSong, getSongs, submitted, uploadFile } from "@/features/music"

import Layout from "@/components/ui/Layout/Layout"
import TrackListItem from "@/components/TrackListItem/TrackListItem"
import { player } from "@/features/music/player"

interface MusicPageProps {}

const MusicPage: FC<MusicPageProps> = () => {
    const currentSong = useStore($currentSong)
    const onUpload = useEvent(uploadFile)
    const onSubmit = useEvent(submitted)
    const onChange = useEvent(changeSong)

    const currentTrack = useStore(player.$currentTrack)
    console.log("render list")

    return (
        <Layout title="Плейлисты">
            <main className="grow px-20 py-10">
                <h2>добро пожаловать</h2>

                <section className="flex flex-col">
                    <div className="flex  flex-col divide-y-2 divide-gray-200">
                        {useList($songs, {
                            keys: [currentTrack],
                            fn: (song) => (
                                <TrackListItem
                                    track={song}
                                    isCurrentTrack={currentTrack?.id === song.id}
                                />
                            ),
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

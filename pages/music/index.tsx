import { GetServerSideProps, NextPage } from "next"
import { allSettled, fork, serialize } from "effector"
import { useEvent, useList, useStore } from "effector-react"

import {
    $countSongs,
    $currentSong,
    $songs,
    changeSong,
    getSongs,
    searchTrack,
    submitted,
    uploadFile,
} from "@/features/music"

import TrackListItem from "@/components/TrackListItem/TrackListItem"
import { winamp } from "@/features/media/winamp"
import PlayIcon from "@/components/ui/icons/PlayIcon/PlayIcon"
import WinampIcon from "@/components/ui/icons/WinampIcon/WinampIcon"

import SearchInput from "@/components/ui/SearchInput/SearchInput"

const MusicPage: NextPage = () => {
    const currentSong = useStore($currentSong)
    const hanldePlayAll = useEvent(winamp.playAllTracksFromList)

    const [onUpload, onSubmit, onChange, handleSearch] = useEvent([
        uploadFile,
        submitted,
        changeSong,
        searchTrack,
    ])

    const currentTrack = useStore(winamp.$currentTrack)

    const handleShowWinamp = useEvent(winamp.show)
    console.log("render list")

    const countSongs = useStore($countSongs)

    return (
        <main className="grow px-20 py-10">
            <SearchInput />

            <details className="mb-4 flex flex-col space-y-2 rounded bg-transparent p-2 open:bg-white open:shadow-sm">
                <summary>Стили</summary>
                <div className=" flex space-x-2 ">
                    <button className="btn-outline btn no-animation btn-xs">Rock</button>
                    <button className="btn-outline btn  no-animation btn-xs">Metal</button>
                    <button className="btn-outline btn no-animation btn-xs">Pop</button>
                    <button className="btn-outline btn no-animation btn-xs">Dance</button>
                    <button className="btn-outline btn no-animation btn-xs">DnB</button>
                </div>
            </details>
            <div className="flex justify-start space-x-2">
                <button onClick={handleShowWinamp} className="btn no-animation btn-square btn-xs">
                    <WinampIcon size="extraSmall" />
                </button>
                <button onClick={hanldePlayAll} className="btn no-animation btn-xs gap-2 ">
                    <PlayIcon size="extraSmall" />
                    play all tracks
                </button>
            </div>

            <section className="flex flex-col py-4">
                <div className="flex  flex-col divide-y-2 divide-gray-200">
                    {useList($songs, {
                        keys: [currentTrack, countSongs],
                        fn: (song) => (
                            <TrackListItem
                                track={song}
                                isCurrentTrack={currentTrack?.id === song.id}
                            />
                        ),
                    })}
                </div>
                <span className="x">Треков: {countSongs}</span>
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

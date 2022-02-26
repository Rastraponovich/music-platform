import { GetServerSideProps, NextPage } from "next"
import { allSettled, fork, serialize } from "effector"
import { useEvent, useList, useStore } from "effector-react"

import { $countSongs, $songs, getSongs } from "@/features/music"

import TrackListItem from "@/components/TrackListItem/TrackListItem"
import { winamp } from "@/features/media/winamp"
import PlayIcon from "@/components/ui/icons/PlayIcon/PlayIcon"
import WinampIcon from "@/components/ui/icons/WinampIcon/WinampIcon"

import SearchInput from "@/components/ui/SearchInput/SearchInput"

import MusicFilter from "@/components/MusicFilter/MusicFilter"
import PlaylistFormModal from "@/components/ui/PlaylistForm/PlaylistFormModal"
import UploadFormModal from "@/components/UploadForm/UploadFormModal"

const MusicPage: NextPage = () => {
    const hanldePlayAll = useEvent(winamp.playAllTracksFromList)

    const currentTrack = useStore(winamp.$currentTrack)

    const handleShowWinamp = useEvent(winamp.show)
    console.log("render list")

    const countSongs = useStore($countSongs)

    return (
        <main className="grow px-20 py-10">
            <SearchInput />
            <MusicFilter />

            <div className="flex justify-start space-x-2">
                <button
                    onClick={handleShowWinamp}
                    className="btn no-animation btn-square btn-xs hover:shadow-lg"
                >
                    <WinampIcon size="extraSmall" />
                </button>
                <button
                    onClick={hanldePlayAll}
                    className="btn no-animation btn-xs gap-2  hover:shadow-lg"
                >
                    <PlayIcon size="extraSmall" />
                    play all tracks
                </button>
                <PlaylistFormModal />

                <div className="grow"></div>
                <UploadFormModal />
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

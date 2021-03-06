import { GetServerSideProps, NextPage } from "next"
import { allSettled, fork, serialize } from "effector"
import { useEvent, useList, useStore } from "effector-react"

import { $countSongs, $songs, getSongs } from "@/features/music"

import TrackListItem from "@/components/TrackListItem/TrackListItem"
import { winamp } from "@/features/media/winamp"
import WinampIcon from "@/components/ui/icons/WinampIcon/WinampIcon"

import SearchInput from "@/components/ui/SearchInput/SearchInput"

import MusicFilter from "@/components/MusicFilter/MusicFilter"
import PlaylistFormModal from "@/components/ui/PlaylistForm/PlaylistFormModal"
import UploadFormModal from "@/components/UploadForm/UploadFormModal"
import { MusicNoteIcon, PlayIcon } from "@heroicons/react/solid"
import { useState } from "react"
import { Nullable } from "@/types"
import clsx from "clsx"
import { Song } from "@/features/music/types"

const MusicPage: NextPage = () => {
    const [fav, setFavs] = useState<Song["id"][]>([])
    const handleAddToFavorites = (id: Song["id"]) => {
        const candidate = fav.some((item) => item === id)

        if (candidate) {
            setFavs(fav.filter((item) => item !== id))
        } else {
            setFavs([...fav, id])
        }
    }
    const hanldePlayAll = useEvent(winamp.playAllTracksFromList)

    const [activePage, setActivePage] = useState<Nullable<number>>(null)

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
                    title="открыть winamp"
                    className="btn btn-square no-animation btn-xs hover:shadow-lg"
                >
                    <WinampIcon size="extraSmall" />
                </button>
                <button
                    onClick={hanldePlayAll}
                    title="воспроизвести все треки"
                    className="btn no-animation btn-xs gap-2  hover:shadow-lg"
                >
                    <PlayIcon className="h-4 w-4" />
                    play all tracks
                </button>
                <PlaylistFormModal />

                <div className="grow"></div>
                <UploadFormModal />
            </div>

            <section className="flex flex-col py-4">
                <div className="mb-2 flex items-center self-end text-right text-sm">
                    <MusicNoteIcon className="mr-2 h-4 w-4 rounded-full bg-black p-1 text-white" />
                    <span className="mb-1">всего треков: {countSongs}</span>
                </div>
                <div className="flex  flex-col divide-y-2 divide-gray-200">
                    {useList($songs, {
                        keys: [currentTrack, countSongs, fav],
                        fn: (song) => (
                            <TrackListItem
                                addToFavorites={handleAddToFavorites}
                                favorite={fav.some((item) => item === song.id)}
                                track={song}
                                isCurrentTrack={currentTrack?.id === song.id}
                            />
                        ),
                    })}
                </div>
            </section>

            <div className="btn-group items-center justify-center">
                <button
                    className={clsx("btn btn-sm", activePage === 1 && "btn-active")}
                    onClick={() => setActivePage(1)}
                >
                    1
                </button>
                <button
                    className={clsx("btn btn-sm", activePage === 2 && "btn-active")}
                    onClick={() => setActivePage(2)}
                >
                    2
                </button>
                <button
                    className={clsx("btn btn-sm", activePage === 3 && "btn-active")}
                    onClick={() => setActivePage(3)}
                >
                    3
                </button>
                <button
                    className={clsx("btn btn-sm", activePage === 4 && "btn-active")}
                    onClick={() => setActivePage(4)}
                >
                    4
                </button>
            </div>
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

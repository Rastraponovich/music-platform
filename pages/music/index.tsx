import { GetServerSideProps, NextPage } from "next"
import { allSettled, fork, serialize } from "effector"
import { useEvent, useStore } from "effector-react"

import { songModel, Tracklist } from "@/src/entity/songs"
import { winamp } from "@/features/media/winamp"
import WinampIcon from "@/components/ui/icons/WinampIcon/WinampIcon"

import SearchInput from "@/components/ui/SearchInput/SearchInput"

import MusicFilter from "@/components/MusicFilter/MusicFilter"
import PlaylistFormModal from "@/components/ui/PlaylistForm/PlaylistFormModal"
import UploadFormModal from "@/components/UploadForm/UploadFormModal"
import { MusicNoteIcon, PlayIcon } from "@heroicons/react/solid"
import { memo, useState } from "react"
import { Nullable } from "@/types"
import clsx from "clsx"

const MusicPage: NextPage = () => {
    const countSongs = songModel.selectors.useCountSongs()

    return (
        <main className="grow px-20 py-10">
            <SearchInput />
            <MusicFilter />
            <PageActions />

            <section className="flex flex-col py-4">
                <div className="mb-2 flex items-center self-end text-right text-sm">
                    <MusicNoteIcon className="mr-2 h-4 w-4 rounded-full bg-black p-1 text-white" />
                    <span className="mb-1">всего треков: {countSongs}</span>
                </div>
                <Tracklist />
            </section>
            <Pagination />
        </main>
    )
}

export default MusicPage

export const getServerSideProps: GetServerSideProps = async () => {
    const scope = fork()

    await allSettled(songModel.actions.getSongs, { scope })

    return {
        props: {
            initialState: serialize(scope),
        },
    }
}

const PageActions = () => {
    const handleShowWinamp = useEvent(winamp.show)
    const hanldePlayAll = useEvent(winamp.playAllTracksFromList)

    return (
        <div className="flex flex-wrap justify-start gap-2">
            <button
                onClick={handleShowWinamp}
                title="открыть winamp"
                className="btn no-animation btn-square btn-xs hover:shadow-lg"
            >
                <WinampIcon size="extraSmall" />
            </button>
            <button
                onClick={hanldePlayAll}
                title="воспроизвести все треки"
                className="btn no-animation btn-xs hover:shadow-lg"
            >
                <PlayIcon className="h-4 w-4" />
                play all tracks
            </button>
            <PlaylistFormModal />
            <UploadFormModal />
        </div>
    )
}

const Pagination = () => {
    const [currentPage, setCurrentPage] = useState(1)
    const pages = [1, 2, 3, 4]
    return (
        <div className="btn-group items-center justify-center">
            {pages.map((page) => (
                <PaginationButton
                    id={page}
                    onClick={setCurrentPage}
                    isActive={currentPage === page}
                />
            ))}
        </div>
    )
}

interface PaginationButtonProps {
    onClick(id: number): void
    id: number
    isActive: boolean
}

const PaginationButton = memo(({ onClick, isActive, id }: PaginationButtonProps) => {
    const handleButtonClicked = () => {
        onClick(id)
    }

    return (
        <button
            className={clsx("btn btn-sm", isActive && "btn-active")}
            onClick={handleButtonClicked}
        >
            {id}
        </button>
    )
})

PaginationButton.displayName = "PaginationButton"

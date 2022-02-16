import { playlist, winamp, winampStates } from "@/features/media/winamp"
import { Nullable } from "@/types"
import clsx from "clsx"
import { useEvent, useList, useStore } from "effector-react/scope"
import React, { FC, useState, MouseEvent, useCallback } from "react"
import MiniTimer from "./MiniTimer"
import PlaylistHeader from "./PlaylistHeader"
import PlaylistTrack from "./PlaylistTrack"

interface PlayListWindowProps {}

const WINDOW_NAME = "PLAYLIST"

const PlayListWindow: FC<PlayListWindowProps> = () => {
    const [selectedTrack, setSelectedTrack] = useState<Nullable<number>>(null)

    const handleActiveWindow = useEvent(winampStates.changeWindowState)
    const visible = useStore(playlist.$visiblePlaylist)
    const currentIndex = useStore(playlist.$currentPlayedTrackIndexPlaylist)

    const playing = useStore(winamp.$mediaStatus)
    const playList = useStore(playlist.$playList)

    const [pos, setpos] = useState<{ [key: string]: number | string }>({
        clientX: "1rem",
        clientY: "327px",
        bottom: "unset",
    })

    const [diff, setDiff] = useState({
        diffX: 0,
        diffY: 0,
    })

    const [allowDragging, setAllowDragging] = useState<boolean>(false)

    const handleSetSelectedTrack = useCallback((id) => setSelectedTrack(id), [selectedTrack])

    const handleDragStart = useCallback(
        (e: MouseEvent<HTMLElement>) => {
            handleActiveWindow(WINDOW_NAME)
            e.preventDefault()
            setDiff({
                diffX: e.screenX - e.currentTarget.getBoundingClientRect().left,
                diffY: e.screenY - e.currentTarget.getBoundingClientRect().top,
            })
            setpos({ ...pos, bottom: "unset" })
            setAllowDragging(true)
        },
        [diff, pos, allowDragging]
    )

    const handleDragging = useCallback(
        (e: MouseEvent<HTMLElement>) => {
            if (allowDragging) {
                const left = e.screenX - diff.diffX
                const top = e.screenY - diff.diffY

                if (e.pageX === 0) {
                    return setTimeout(() => {
                        setpos({ ...pos, clientX: 0 })
                    }, 500)
                }

                setpos({ ...pos, clientX: left, clientY: top })
            }
        },
        [pos, allowDragging]
    )

    const handleDragEnd = useCallback(
        (e: MouseEvent<HTMLElement>) => setAllowDragging(false),
        [allowDragging]
    )
    return (
        <aside
            className={clsx(
                "font-[15px] fixed left-0 top-[141px] z-50  flex min-w-[275px] cursor-winamp flex-col font-[Arial] text-[#00FF00]",
                !visible && "hidden"
            )}
            style={{
                top: pos.clientY,
                left: pos.clientX,
                bottom: pos.bottom,
                imageRendering: "pixelated",
            }}
        >
            <PlaylistHeader
                onMouseDown={handleDragStart}
                onMouseMove={handleDragging}
                onMouseUp={handleDragEnd}
                onMouseLeave={handleDragEnd}
            />
            <div className="flex">
                <div
                    style={{
                        backgroundImage: `url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAdAgMAAADjkWVKAAAADFBMVEUAAAAdHS0pKUBqano8VvpZAAAAD0lEQVQI12OoilvCQGcMALzxKw1EtyFgAAAAAElFTkSuQmCC)`,
                    }}
                    className="w-3 min-w-[12px] bg-repeat-y"
                ></div>

                <div
                    className={
                        "flex  min-h-[150px] grow cursor-winamp flex-col  bg-black py-1 shadow-lg"
                    }
                >
                    {useList(playlist.$playList, {
                        keys: [playList.length, currentIndex, playing, selectedTrack],
                        fn: (track, index) => (
                            <PlaylistTrack
                                track={track}
                                index={index}
                                setSelectedTrack={handleSetSelectedTrack}
                                selectedTrack={selectedTrack}
                            />
                        ),
                    })}
                </div>

                <div
                    className="min-w-5 relative w-5 pb-[18px]"
                    style={{
                        backgroundRepeat: " repeat-y",
                        backgroundPosition: "100% 0",

                        backgroundImage: `url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAdAgMAAADX6KRWAAAADFBMVEUAAAAdHS0pKUBqano8VvpZAAAAEklEQVQI12OwmrXq1UuGIUICAIEjYC7HaOXEAAAAAElFTkSuQmCC)`,
                    }}
                ></div>
            </div>
            <div className="playlist-bottom draggable relative h-[38px] max-h-[38px] min-h-[38px] w-full">
                <div className="playlist-bottom-left draggable absolute h-full w-[125px] "></div>
                <div className="playlist-bottom-center draggable"></div>
                <div className="playlist-bottom-right draggable absolute right-0 h-full w-[150px] text-[9px]">
                    <MiniTimer />
                </div>
            </div>
        </aside>
    )
}

export default PlayListWindow

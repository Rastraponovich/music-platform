import { playlist, winamp, winampStates } from "@/features/media/winamp"
import { useDelPressKeyButton } from "@/hooks/useChangeCurrentTime"
import { useDraggable } from "@/hooks/useDraggable"
import clsx from "clsx"
import { useEvent, useList, useStore } from "effector-react/scope"
import React, { FC, useState, MouseEvent, useCallback } from "react"
import MiniTimer from "./MiniTimer"
import PlaylistHeader from "./PlaylistHeader"
import PlaylistTrack from "./PlaylistTrack"

interface PlayListWindowProps {}

const WINDOW_NAME = "PLAYLIST"

const PlayListWindow: FC<PlayListWindowProps> = () => {
    const handler = useDelPressKeyButton()

    const handleActiveWindow = useEvent(winampStates.changeWindowState)
    const visible = useStore(playlist.$visiblePlaylist)
    const currentIndex = useStore(playlist.$currentPlayedTrackIndexPlaylist)
    const highlightTrackInPlaylist = useStore(playlist.$selectedTrackInPlayList)

    const playing = useStore(winamp.$mediaStatus)
    const playList = useStore(playlist.$playList)

    const { position, onDragging, onDragEnd, onDragStart } = useDraggable(WINDOW_NAME)

    return (
        <aside
            className={clsx(
                "font-[15px] fixed left-0 top-[141px] z-50  flex min-w-[275px] cursor-winamp flex-col font-[Arial] text-[#00FF00]",
                !visible && "hidden"
            )}
            style={{
                top: position.clientY,
                left: position.clientX,
                imageRendering: "pixelated",
            }}
        >
            <PlaylistHeader
                onMouseDown={onDragStart}
                onMouseMove={onDragging}
                onMouseUp={onDragEnd}
                onMouseLeave={onDragEnd}
            />
            <div className="flex" onClick={() => handleActiveWindow(WINDOW_NAME)}>
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
                        keys: [playList.length, currentIndex, playing, highlightTrackInPlaylist],
                        fn: (track, index) => <PlaylistTrack track={track} index={index} />,
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

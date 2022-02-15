import { duration, playlist, winamp } from "@/features/media/winamp"
import { Nullable } from "@/types"
import clsx from "clsx"
import { useEvent, useList, useStore } from "effector-react/scope"
import React, { FC, useState, MouseEvent } from "react"
import MiniTimer from "./MiniTimer"

interface PlayListProps {}

const PlayList: FC<PlayListProps> = () => {
    const [selectedTrack, setSelectedTrack] = useState<Nullable<number>>(null)
    const durationTracksInPlaylist = useStore(duration.$durationTracksInPlaylist)

    const visible = useStore(playlist.$visiblePlaylist)
    const currentIndex = useStore(playlist.$currentPlayedTrackIndexPlaylist)

    const playing = useStore(winamp.$mediaStatus)
    const playList = useStore(playlist.$playList)

    const handleSelectNewTrack = useEvent(playlist.doubleClick)

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

    const handleDragStart = (e: MouseEvent<HTMLElement>) => {
        e.preventDefault()
        setDiff({
            diffX: e.screenX - e.currentTarget.getBoundingClientRect().left,
            diffY: e.screenY - e.currentTarget.getBoundingClientRect().top,
        })
        setpos({ ...pos, bottom: "unset" })
        setAllowDragging(true)
    }
    const handleDragging = (e: MouseEvent<HTMLElement>) => {
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
    }
    const handleDragEnd = (e: MouseEvent<HTMLElement>) => setAllowDragging(false)
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
            <div
                className="playlist-top draggable min-h-5 min-w-5 relative flex w-full"
                onMouseDown={handleDragStart}
                onMouseMove={handleDragging}
                onMouseUp={handleDragEnd}
                onMouseLeave={handleDragEnd}
            >
                <div className="playlist-top-left draggable w-[25px]"></div>
                <div className="playlist-top-left-spacer draggable "></div>
                <div className="playlist-top-left-fill draggable grow "></div>
                <div className="playlist-top-title draggable w-[100px]"></div>
                <div className="playlist-top-right-spacer draggable w-[13px]"></div>
                <div className="playlist-top-right-fill draggable grow"></div>
                <div className="playlist-top-right draggable w-[25px]">
                    <div id="playlist-shade-button" className=""></div>
                    <div id="playlist-close-button" className=""></div>
                </div>
            </div>
            <div className="flex">
                <div
                    style={{
                        backgroundRepeat: " repeat-y",
                        width: "12px",
                        minWidth: "12px",
                        backgroundImage: `url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAdAgMAAADjkWVKAAAADFBMVEUAAAAdHS0pKUBqano8VvpZAAAAD0lEQVQI12OoilvCQGcMALzxKw1EtyFgAAAAAElFTkSuQmCC)`,
                    }}
                ></div>

                <div
                    className={clsx(
                        "flex  min-h-[150px] grow flex-col bg-black  py-1 shadow-lg",
                        "cursor-winamp"
                    )}
                >
                    {useList(playlist.$playList, {
                        keys: [selectedTrack, playList.length, currentIndex, playing],
                        fn: (track, index) => (
                            <div
                                onClick={() => setSelectedTrack(index)}
                                onDoubleClick={() => handleSelectNewTrack(index)}
                                // onKeyPress={(e) => useEscapeFn(e)}
                                // onKeyDown={(e) => useEscapeFn(e)}
                                className={clsx(
                                    "flex select-none justify-between px-1 text-[9px]",
                                    selectedTrack === index && "bg-[#0000C6]",
                                    currentIndex === index ? "text-white" : "text-[#00FF00] "
                                )}
                            >
                                <span className="truncate">
                                    {index + 1}. {track.name}
                                </span>
                                <span>
                                    {Math.floor(track.metaData.format.duration / 60)}:
                                    {Math.ceil(track.metaData.format.duration % 60) < 10
                                        ? `0${Math.ceil(track.metaData.format.duration % 60)}`
                                        : Math.ceil(track.metaData.format.duration % 60)}
                                </span>
                            </div>
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

export default PlayList

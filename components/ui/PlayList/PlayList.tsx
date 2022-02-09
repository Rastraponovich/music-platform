import { player, PlayListGate } from "@/features/music/player"
import { Song } from "@/features/music/types"
import { Nullable } from "@/types"
import clsx from "clsx"
import { useEvent, useGate, useList, useStore } from "effector-react/scope"
import React, { memo, FC, useState } from "react"

interface PlayListProps {}

const PlayList: FC<PlayListProps> = () => {
    const [selectedTrack, setSelectedTrack] = useState<Nullable<number>>(null)
    const playlistTracksLength = useStore(player.playList.$playlistTracksLength)

    const currentIndex = useStore(player.playList.$currentPlayedTrackIndexPlaylist)

    const playing = useStore(player.$playing)
    const playList = useStore(player.playList.$playList)
    const visible = useStore(player.playList.$visiblePlaylist)

    const handleSelectNewTrack = useEvent(player.playList.selectTrackInPlayList)
    return (
        <div
            className="font-[15px] flex cursor-winamp flex-col font-[Arial]  text-[#00FF00]"
            style={{ imageRendering: "pixelated" }}
        >
            <div className="playlist-top draggable min-h-5 min-w-5 relative flex w-full">
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
                        "cursor-winamp",
                        !visible && "hidden"
                    )}
                >
                    {useList(player.playList.$playList, {
                        keys: [selectedTrack, playList.length, currentIndex, playing],
                        fn: (track, index) => (
                            <div
                                onClick={() => setSelectedTrack(index)}
                                onDoubleClick={() => handleSelectNewTrack(index)}
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
                    <span
                        className="absolute top-[10px] left-[7px] block h-2.5 align-text-top"
                        style={{
                            imageRendering: "pixelated",
                        }}
                    >
                        {Math.floor(playlistTracksLength / 60)}:
                        {Math.ceil(playlistTracksLength % 60) < 10
                            ? `0${Math.ceil(playlistTracksLength % 60)}`
                            : Math.ceil(playlistTracksLength % 60)}
                    </span>
                </div>
            </div>
        </div>
    )
}

export default memo(PlayList)

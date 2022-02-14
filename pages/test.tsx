import { winamp, winampControls, playlist } from "@/features/media/winamp"
import clsx from "clsx"
import { useEvent, useStore } from "effector-react/scope"
import dynamic from "next/dynamic"
import React, { memo, FC, useState, useEffect } from "react"

interface testProps {}

const TestPlayer = dynamic(() => import("@/components/Test"), { ssr: false })

const Test: FC<testProps> = () => {
    const handleInitWinamp = useEvent(winamp.init)

    const playList = useStore(playlist.$playList)
    const selectedTrack = useStore(playlist.$selectedTrackInPlayList)
    const handleDoubleClick = useEvent(playlist.doubleClick)
    const handleSelectTrack = useEvent(playlist.selectTrack)
    useEffect(() => {
        handleInitWinamp()
    }, [])

    return (
        <div className="flex grow p-20">
            <TestPlayer />
            <div className="mt-4 flex flex-col">
                {playList.map((track, idx) => (
                    <div
                        key={track.id}
                        onDoubleClick={() => handleDoubleClick(idx)}
                        className={clsx(selectedTrack === idx && "bg-blue-500")}
                        onClick={() => handleSelectTrack(idx)}
                    >
                        {track.artist} - {track.name}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Test

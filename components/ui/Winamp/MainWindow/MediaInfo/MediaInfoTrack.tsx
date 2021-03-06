import React, { memo, useEffect, useState, MouseEvent, useMemo, useRef } from "react"

import { Nullable } from "@/types"
import { Track } from "@/features/music/types"
import CharacterStrings from "../../CharacterStrings/CharacterStrings"
import { marqueInfo } from "@/features/media/winamp"
import { useStore } from "effector-react"

const SEPARATOR = "  ***  "
const MARQUEE_MAX_LENGTH = 31

const isLong = (text: string): boolean => text.length >= MARQUEE_MAX_LENGTH

interface MediaInfoTrackProps {
    currentTrack: Track
    currentId: number
}

const MediaInfoTrack = ({ currentTrack, currentId }: MediaInfoTrackProps) => {
    let timerId = useRef<any>(null)
    const ref = useRef<Nullable<HTMLDivElement>>(null)

    const [pos, setpos] = useState(0)
    const [diff, setDiff] = useState(0)

    const enabledMarque = useStore(marqueInfo.$enabledMaruqeInfo)
    const marqueInfoText = useStore(marqueInfo.$winampMarqueInfo)

    const [track, setTrack] = useState(SEPARATOR)
    const [allowDragging, setAllowDragging] = useState<boolean>(false)

    const min = useMemo(
        () => Math.floor(currentTrack.metaData.format.duration / 60),
        [currentTrack]
    )
    const sec = useMemo(
        () => Math.floor(currentTrack.metaData.format.duration % 60),
        [currentTrack]
    )

    useEffect(() => {
        setpos(0)
    }, [currentTrack])

    useEffect(() => {
        const total = `(${min < 10 ? `0${min}` : min}:${sec < 10 ? `0${sec}` : sec})`
        const text = `${currentId !== null && currentId + 1}. ${currentTrack.artist} - ${
            currentTrack.name
        }   ${total}`

        setTrack(isLong(text) ? `${text}${SEPARATOR}${text}` : text.padEnd(MARQUEE_MAX_LENGTH, " "))

        return () => setpos(1)
    }, [currentId, min, sec, track.length])

    useEffect(() => {
        timerId.current = setInterval(() => {
            if (!allowDragging && track.length > MARQUEE_MAX_LENGTH) {
                if (pos <= -track.length * 2.6) return setpos(0)
                setpos(pos - 5)
            }
        }, 220)
        return () => clearInterval(timerId.current)
    }, [pos, currentId, allowDragging])

    const handleDragStart = (e: MouseEvent<HTMLElement>) => {
        e.preventDefault()
        setDiff(e.screenX)
        setAllowDragging(true)
    }
    const handleDragging = (e: MouseEvent<HTMLElement>) => {
        if (allowDragging) {
            setpos(e.screenX - diff)
        }
    }
    const handleDragEnd = (e: MouseEvent<HTMLElement>) => {
        setAllowDragging(false)
    }
    return (
        <div
            id="marquee"
            className="text relative"
            title="Song Title"
            onMouseDown={handleDragStart}
            onMouseMove={handleDragging}
            onMouseUp={handleDragEnd}
            onMouseLeave={handleDragEnd}
        >
            {enabledMarque ? (
                <div className="whitespace-nowrap text-[8px]  text-[#00FF00] will-change-transform">
                    <CharacterStrings>{marqueInfoText}</CharacterStrings>
                </div>
            ) : (
                <div
                    className="whitespace-nowrap text-[8px]  text-[#00FF00] will-change-transform"
                    ref={ref}
                    style={{
                        transform: `translateX(${pos}px)`,
                    }}
                >
                    <CharacterStrings>{track}</CharacterStrings>
                </div>
            )}
        </div>
    )
}

export default memo(MediaInfoTrack)

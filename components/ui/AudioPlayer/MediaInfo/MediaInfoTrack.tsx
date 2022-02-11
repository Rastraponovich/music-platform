import { Song } from "@/features/music/types"
import React, { memo, FC, useEffect, useState, MouseEvent } from "react"
import CharacterStrings from "../../CharacterStrings/CharacterStrings"

const SEPARATOR = "  ***  "
const MARQUEE_MAX_LENGTH = 31
const isLong = (text: string): boolean => text.length >= MARQUEE_MAX_LENGTH

interface MediaInfoTrackProps {
    currentTrack: Song
    currentId: number
}

const randomInteger = (min: number, max: number) => {
    // случайное число от min до (max+1)
    let rand = min + Math.random() * (max + 1 - min)
    return Math.floor(rand)
}

const MediaInfoTrack: FC<MediaInfoTrackProps> = ({ currentTrack, currentId }) => {
    let timerid: any
    const [pos, setpos] = useState(0)

    const [track, setTrack] = useState(SEPARATOR)

    useEffect(() => {
        setpos(0)

        return () => setpos(0)
    }, [currentTrack])

    useEffect(() => {
        const min = Math.floor(currentTrack?.metaData.format.duration / 60)
        const sec = Math.ceil(currentTrack?.metaData.format.duration % 60)

        const total = `(${min < 10 ? `0${min}` : min} :${sec < 10 ? `0${sec}` : sec})`
        const text = `${currentId !== null ? currentId + 1 : null}. ${currentTrack?.artist} - ${
            currentTrack?.name
        }   ${total}`

        setTrack(isLong(text) ? `${text}${SEPARATOR}${text}` : text.padEnd(MARQUEE_MAX_LENGTH, " "))

        return () => setpos(track.length * 2.6)
    }, [currentTrack, currentId])

    const [allowDragging, setAllowDragging] = useState<boolean>(false)

    useEffect(() => {
        timerid = setInterval(() => {
            if (!allowDragging) {
                if (pos <= -track.length * 2.6) return setpos(0)
                setpos(pos - 5)
            }
        }, 220)

        return () => clearInterval(timerid)
    }, [pos, currentId, allowDragging])

    const [diff, setDiff] = useState(0)

    const handleDragStart = (e: MouseEvent<HTMLElement>) => {
        e.preventDefault()
        setDiff(e.screenX - e.currentTarget.getBoundingClientRect().left)
        setAllowDragging(true)
    }
    const handleDragging = (e: MouseEvent<HTMLElement>) => {
        if (allowDragging) {
            const left = e.screenX - diff

            setpos(left)
        }
    }
    const handleDragEnd = (e: MouseEvent<HTMLElement>) => setAllowDragging(false)
    return (
        <div
            id="marquee"
            className="text"
            title="Song Title"
            onMouseDown={handleDragStart}
            onMouseMove={handleDragging}
            onMouseUp={handleDragEnd}
            // onMouseLeave={handleDragEnd}
        >
            <div
                className="whitespace-nowrap text-[8px]  text-[#00FF00] will-change-transform"
                style={{
                    transform: `translateX(${pos}px)`,
                }}
            >
                <CharacterStrings>{track}</CharacterStrings>
            </div>
        </div>
    )
}

export default memo(MediaInfoTrack)

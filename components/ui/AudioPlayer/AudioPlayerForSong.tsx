import TrackProgress from "@/components/TrackProgress/TrackProgress"
import {
    $duration,
    $loopState,
    $pgorgress,
    $trackPlayingState,
    $volume,
    loopStateClicked,
    playClicked,
    selectTrack,
    setDuration,
    setProgress,
    setVolume,
} from "@/features/music"
import { Song } from "@/features/music/types"
import { useEvent, useStore } from "effector-react"
import Image from "next/image"

import React, { memo, FC, useState, useEffect, useRef } from "react"
import PauseIcon from "../icons/PauseIcon/PauseIcon"
import PlayIcon from "../icons/PlayIcon/PlayIcon"

interface AudioPlayerForSongProps {
    track: Song
}
let audio: HTMLAudioElement

const AudioPlayerForSong: FC<AudioPlayerForSongProps> = ({ track }) => {
    const volume = useStore($volume)
    const duration = useStore($duration)
    const currentTime = useStore($pgorgress)
    const playing = useStore($trackPlayingState)
    const loop = useStore($loopState)

    const handleSetProgress = useEvent(setProgress)
    const handleSetDuration = useEvent(setDuration)
    const handleSetVolume = useEvent(setVolume)
    const handlePlayClicked = useEvent(playClicked)
    const hanldeLoopStateSet = useEvent(loopStateClicked)

    const hanldeSetCurrentTrack = useEvent(selectTrack)

    const [seconds, setSeconds] = useState(0)
    const [minutes, setMinutes] = useState(0)

    //инициализация
    useEffect(() => {
        if (!audio) {
            audio = new Audio(`${process.env.NEXT_PUBLIC_BACKEND}/music/${track.path}`)

            setAudio(loop, track)
        }
        // return () => audio.pause()
    }, [audio, track])

    //конвертация времени
    useEffect(() => {
        if (currentTime < 60) {
            setSeconds(currentTime)
        } else {
            setSeconds((prev) => currentTime % 60)
            setMinutes(Math.floor(currentTime / 60))
        }

        return () => {
            setSeconds(0)
            setMinutes(0)
        }
    }, [currentTime, duration])

    const setAudio = (loop: boolean, track: Song) => {
        audio.src = `${process.env.NEXT_PUBLIC_BACKEND}/music/${track.path}`
        audio.volume = volume / 100
        audio.loop = loop

        audio.onloadedmetadata = () => {
            handleSetDuration(Math.ceil(audio.duration))
        }
        audio.ontimeupdate = () => {
            handleSetProgress(Math.ceil(audio.currentTime))
        }
        audio.onvolumechange = () => console.log(audio.volume)
        handlePlayClicked(false)
    }

    const play = () => {
        if (!playing) {
            hanldeSetCurrentTrack(track)
        }

        return handlePlayClicked(!playing)
    }

    return (
        <div className="flex  flex-col">
            <div className="grid grid-cols-12 items-center">
                <button onClick={play} className="col-span-2">
                    {playing ? <PauseIcon /> : <PlayIcon />}
                </button>
                <div className="col-span-6 flex space-x-2">
                    <Image
                        src={`${process.env.NEXT_PUBLIC_BACKEND}/images/${track.cover}`}
                        objectFit="contain"
                        height={50}
                        width={50}
                    />
                    <div className=" flex grow flex-col">
                        <span className="text-base font-medium">{track.name}</span>
                        <span className="text-sm font-light text-gray-800">{track.artist}</span>
                    </div>
                </div>
                <span className="col-span-1 col-start-10 mr-2 flex justify-self-end text-sm text-gray-800">
                    {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
                </span>
                <input
                    type="range"
                    min={0}
                    max={100}
                    value={volume}
                    onChange={(e) => handleSetVolume(Number(e.target.value))}
                    className="col-span-2 col-end-13"
                    onSeeking={() => console.log(`${volume.toString()}%`)}
                />
                <input
                    type="range"
                    min={0}
                    max={duration}
                    value={currentTime}
                    onChange={(e) => setProgress(Number(e.target.value))}
                    className="col-span-8 col-start-3"
                />
            </div>

            <div className="flex flex-col">
                <label className="mb-2 flex items-center space-x-2">
                    <span>repeat</span>
                    <input type="checkbox" checked={loop} onChange={hanldeLoopStateSet} />
                </label>
            </div>
        </div>
    )
}

export default memo(AudioPlayerForSong)

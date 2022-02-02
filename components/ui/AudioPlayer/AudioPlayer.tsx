import TrackProgress from "@/components/TrackProgress/TrackProgress"
import {
    $duration,
    $pgorgress,
    $volume,
    setDuration,
    setProgress,
    setVolume,
} from "@/features/music"
import { Song } from "@/features/music/types"
import { useEvent, useStore } from "effector-react"
import Image from "next/image"

import React, { memo, FC, useState, useEffect } from "react"
import PauseIcon from "../icons/PauseIcon/PauseIcon"
import PlayIcon from "../icons/PlayIcon/PlayIcon"

interface AudioPlayerProps {
    track: Song
}
let audio: HTMLAudioElement

const AudioPlayer: FC<AudioPlayerProps> = ({ track }) => {
    const volume = useStore($volume)
    const duration = useStore($duration)
    const currentTime = useStore($pgorgress)
    const [pause, setPause] = useState(true)

    const handleSetProgress = useEvent(setProgress)
    const handleSetDuration = useEvent(setDuration)
    const handleSetVolume = useEvent(setVolume)

    const [listens, setListens] = useState(0)
    const [listensAdded, setListensAdded] = useState(false)
    const [listnerTimer, setListnerTimer] = useState(0)

    const [listenStatic, setListenStatic] = useState<{ startPlaying: number; endPlyaing: number }>({
        startPlaying: 0,
        endPlyaing: 0,
    })

    const [loop, setLoop] = useState(false)

    const [seconds, setSeconds] = useState(0)
    const [minutes, setMinutes] = useState(0)

    //инициализация
    useEffect(() => {
        if (!audio) {
            audio = new Audio()
            setAudio()
        }
        // return () => audio.pause()
    }, [audio])
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

    let timerId: any

    //подсчет прослушки

    useEffect(() => {
        if (!pause) {
            timerId = setInterval(() => {
                setListnerTimer((prev) => ++prev)
            }, 1000)
        }
        return () => clearInterval(timerId)
    }, [audio, pause])

    //добавление прослушивания
    useEffect(() => {
        if (listnerTimer > 10 && !listensAdded) {
            setListens((prev) => ++prev)
            setListensAdded(true)
        }
    }, [listensAdded, listnerTimer])

    //лупинг
    useEffect(() => {
        audio.loop = loop
    }, [loop])

    const setAudio = () => {
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
        setPause(true)
    }

    useEffect(() => {
        if (currentTime >= duration) {
            setAudio()
        }
    }, [currentTime])

    useEffect(() => {
        if (audio.seeking) console.log(currentTime)
    }, [audio, currentTime, volume])

    const play = () => {
        if (pause) {
            audio.play()
            setListenStatic((prev) => ({ ...prev, startPlaying: Date.now() }))
        }
        if (!pause) {
            audio.pause()
            setListenStatic((prev) => ({ ...prev, endPlyaing: Date.now() }))
        }
        return setPause((prev) => !prev)
    }

    const changeVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
        audio.volume = Number(e.target.value) / 100
        handleSetVolume(Number(e.target.value))
    }
    const changeCurrentTime = (e: React.ChangeEvent<HTMLInputElement>) => {
        audio.currentTime = Number(e.target.value)
        setProgress(Number(e.target.value))
    }

    return (
        <div className="flex  flex-col">
            <div className="grid grid-cols-12 items-center">
                <button onClick={play} className="col-span-2">
                    {!pause ? <PauseIcon /> : <PlayIcon />}
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
                    onChange={changeVolume}
                    className="col-span-2 col-end-13"
                    onSeeking={() => console.log(`${volume.toString()}%`)}
                />
                <input
                    type="range"
                    min={0}
                    max={duration}
                    value={currentTime}
                    onChange={changeCurrentTime}
                    className="col-span-8 col-start-3"
                />
            </div>

            <div className="flex flex-col">
                <label className="mb-2 flex items-center space-x-2">
                    <span>repeat</span>
                    <input
                        type="checkbox"
                        checked={loop}
                        onChange={() => setLoop((prev) => !prev)}
                    />
                </label>
            </div>
        </div>
    )
}

export default memo(AudioPlayer)

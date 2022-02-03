import { $refAudio, player } from "@/features/music/player"
import { Song } from "@/features/music/types"
import { useEvent, useStore } from "effector-react"
import Image from "next/image"

import throttle from "lodash/throttle"

import React, { memo, FC, useState, useEffect, useRef } from "react"
import PauseIcon from "../icons/PauseIcon/PauseIcon"
import PlayIcon from "../icons/PlayIcon/PlayIcon"

interface AudioPlayerProps {
    track: Song
}
let audio: HTMLAudioElement

const AudioPlayer: FC<AudioPlayerProps> = ({ track }) => {
    const volume = useStore(player.volume.$volume)
    const duration = useStore(player.$duration)
    const currentTime = useStore(player.progress.$pgorgress)

    const refAudio = useStore($refAudio)

    const playing = useStore(player.$playing)

    const handlePlay = useEvent(player.play)
    const handlePause = useEvent(player.pause)

    const handleLoadTrack = useEvent(player.initTrack)
    const trackLoaded = useStore(player.$trackLoaded)

    const handleSetProgress = useEvent(player.progress.initProgress)
    const handleChangeProgress = useEvent(player.progress.changeProgress)
    const handleSetDuration = useEvent(player.setDuration)
    const handleSetVolume = useEvent(player.volume.initVolume)

    const [loop, setLoop] = useState(false)

    const [seconds, setSeconds] = useState(0)
    const [minutes, setMinutes] = useState(0)

    const setAudio = () => {
        audio.src = `${process.env.NEXT_PUBLIC_BACKEND}/music/${track.path}`
        audio.volume = volume / 100
        audio.loop = loop
        audio.onloadedmetadata = () => handleSetDuration(Math.ceil(audio.duration))
        audio.ontimeupdate = () => handleSetProgress(Math.ceil(audio.currentTime))
        audio.onvolumechange = () => console.log(audio.volume)

        return handlePlay()
    }
    //инициализация
    useEffect(() => {
        audio = new Audio()
        // setAudio()

        handleLoadTrack(audio.readyState)

        //unmount
        return () => audio.pause()
    }, [track])
    //конвертация времени

    let id: any

    useEffect(() => {
        // refAudio.loadFromUrl(`${process.env.NEXT_PUBLIC_BACKEND}/music/${track.path}`, true)
        id = setInterval(() => {
            // console.log(refAudio._source)
        }, 1000)
        return () => clearInterval(id)
    }, [refAudio])

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

    // useEffect(() => {
    //     if (playing) {
    //         timerId = setInterval(() => {
    //             setListnerTimer((prev) => ++prev)
    //         }, 1000)
    //     }
    //     return () => clearInterval(timerId)
    // }, [audio, playing, track])

    //добавление прослушивания
    // useEffect(() => {
    //     if (listnerTimer > 10 && !listensAdded) {
    //         setListens((prev) => ++prev)
    //         setListensAdded(true)
    //     }
    // }, [listensAdded, listnerTimer])

    //лупинг
    // useEffect(() => {
    //     audio.loop = loop
    // }, [loop])

    useEffect(() => {
        if (currentTime >= duration) {
            setAudio()
        }
    }, [currentTime])

    // useEffect(() => {
    //     if (audio.seeking) console.log(currentTime)
    // }, [audio, currentTime, volume])

    const play = () => {
        if (!playing) {
            return handlePlay()
        }
        return handlePause()
    }

    useEffect(() => {
        if (trackLoaded) {
            if (playing) {
                audio.play()
            } else {
                audio.pause()
            }
        }
        // return () => audio.pause()
    }, [playing, trackLoaded])

    const changeVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
        audio.volume = Number(e.target.value) / 100
        handleSetVolume(Number(e.target.value))
        refAudio.setVolume(Number(e.target.value))
    }
    const changeCurrentTime = (e: React.ChangeEvent<HTMLInputElement>) => {
        audio.currentTime = Number(e.target.value)
        handleSetProgress(Number(e.target.value))
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

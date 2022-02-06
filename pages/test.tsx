import { $currentTime, audio, onChangeCurrentTime, onPlay, testGate } from "@/features/music/text"
import { useGate, useStore } from "effector-react"
import { useEvent } from "effector-react/scope"
import React, { memo, FC } from "react"

interface TestProps {}

const Test: FC<TestProps> = () => {
    //http://localhost:4000/music/7f2ddd70-73a5-45a2-83af-1cd3d93c9bf4.mp3
    useGate(testGate, "http://localhost:4000/music/7f2ddd70-73a5-45a2-83af-1cd3d93c9bf4.mp3")
    const handleButtonClick = useEvent(onPlay)
    const handleRangeChange = useEvent(onChangeCurrentTime)

    const currentTime = useStore($currentTime)

    return (
        <div className="flex flex-col bg-gray-300 p-4">
            <span>{currentTime}</span>
            <button onClick={handleButtonClick}>play</button>
            <input
                type="range"
                min={0}
                max={500}
                value={currentTime}
                onChange={(e) => handleRangeChange(Number(e.target.value))}
            />
        </div>
    )
}

export default memo(Test)

import { $visibleEQ, toggleVisibleEQ } from "@/features/music/eq"
import { player } from "@/features/music/player"
import clsx from "clsx"
import { useEvent, useStore } from "effector-react"
import React, { memo, FC, useState, MouseEvent } from "react"

interface PlayerWindowsControlPanelProps {}

interface ButtonProps {
    id: string
    title: string
    active?: boolean
    onClick?(): void
}

const Button = ({ id, title, active = false, onClick }: ButtonProps) => {
    const [clicked, setClicked] = useState(false)

    const onMouseDown = (e: MouseEvent<HTMLButtonElement>) => {
        setClicked(true)
    }
    const onMouseUP = (e: MouseEvent<HTMLButtonElement>) => {
        setClicked(false)
    }

    return (
        <button
            id={id}
            className={clsx(active && "selected", clicked && "active")}
            title={title}
            onClick={onClick}
            onMouseDown={onMouseDown}
            onMouseUp={onMouseUP}
        ></button>
    )
}

const PlayerWindowsControlPanel: FC<PlayerWindowsControlPanelProps> = () => {
    const visiblePlaylist = useStore(player.playList.$visiblePlaylist)
    const setVisiblePlaylist = useEvent(player.playList.setShowVisiblePlaylist)
    const toggleEQ = useEvent(toggleVisibleEQ)
    const visibleEQ = useStore($visibleEQ)

    return (
        <div className="windows">
            <Button
                id="equalizer-button"
                title="Toggle Graphical Equalizer"
                onClick={toggleEQ}
                active={visibleEQ}
            />
            <Button
                id="playlist-button"
                title="Toggle Playlist Editor"
                active={visiblePlaylist}
                onClick={setVisiblePlaylist}
            />
        </div>
    )
}

export default PlayerWindowsControlPanel

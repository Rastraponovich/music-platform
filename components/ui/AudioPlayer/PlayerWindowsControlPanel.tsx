import { eq, playlist } from "@/features/media/winamp"
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
    const visiblePlaylist = useStore(playlist.$visiblePlaylist)
    const setVisiblePlaylist = useEvent(playlist.toggleVisiblePlaylist)
    const toggleEQ = useEvent(eq.toggleVisibleEQ)
    const visibleEQ = useStore(eq.$visibleEQ)

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

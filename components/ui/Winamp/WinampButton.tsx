import clsx from "clsx"
import { memo, useState } from "react"

interface WinampButtonProps {
    id: string
    className?: string
    onClick?(): void
    title?: string
    active?: boolean
}

const WinampButton = ({ id, className, onClick, title, active }: WinampButtonProps) => {
    const [clicked, setClicked] = useState(false)

    const handleClick = () => setClicked((prev) => !prev)

    return (
        <button
            id={id}
            className={clsx(className, clicked && "clicked", active && "active")}
            title={title}
            onClick={onClick}
            onMouseDown={handleClick}
            onMouseUp={handleClick}
            onMouseLeave={() => setClicked(false)}
        />
    )
}

export default memo(WinampButton)

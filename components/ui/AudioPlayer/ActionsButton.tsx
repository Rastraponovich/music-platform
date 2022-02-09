import clsx from "clsx"
import React, { memo, FC, useState } from "react"

interface ActionsButtonProps {
    id: string
    className?: string
    onClick?(): void
    title?: string
}

const ActionsButton: FC<ActionsButtonProps> = ({ id, className, onClick, title }) => {
    const [clicked, setClicked] = useState(false)

    const handleClick = () => setClicked((prev) => !prev)

    return (
        <button
            id={id}
            className={clsx(className, clicked && "clicked")}
            title={title}
            onClick={onClick}
            onMouseDown={handleClick}
            onMouseUp={handleClick}
            onMouseLeave={() => setClicked(false)}
        ></button>
    )
}

export default memo(ActionsButton)

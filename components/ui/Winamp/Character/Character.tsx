import clsx from "clsx"
import React, { memo } from "react"

interface CharacterProps {
    num: string
    className?: string
}

const chars: { [key: string]: string } = {
    "9": "57",
    8: "56",
    7: "55",
    6: "54",
    5: "53",
    "4": "52",
    "3": "51",
    "2": "50",
    "1": "49",
    "0": "48",
}

const Character = ({ num, className }: CharacterProps) => {
    return <span className={clsx(!className && `character character-${chars[num]}`)}>{num}</span>
}

export default memo(Character)

import { memo, ReactNode } from "react"
import deburr from "lodash/deburr"
import clsx from "clsx"

interface Props extends React.HTMLAttributes<HTMLSpanElement> {
    children: string | number
    className?: string
}

export const characterClassName = (char: string | number) =>
    `character-${deburr(char.toString()).toLowerCase().charCodeAt(0)}`

export const CharacterString = memo(({ children: char, className, ...passThrough }: Props) => {
    return (
        <span
            {...passThrough}
            className={`${className || ""} character ${characterClassName(char)}`}
        >
            {char}
        </span>
    )
})

CharacterString.displayName = "CharacterString"

interface CharacterStringProps {
    children: ReactNode
}

export const CharacterStrings = memo(({ children }: CharacterStringProps) => {
    const text = `${children}` || ""
    const chars = text.split("")
    return (
        <>
            {chars.map((character, index) => (
                <CharacterString key={index + character}>{character}</CharacterString>
            ))}
        </>
    )
})
CharacterStrings.displayName = "CharacterStrings"

interface CharacterProps {
    num: string
    className?: string
}

const chars: Record<string | number, string> = {
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

export const Character = memo(({ num, className }: CharacterProps) => {
    return <span className={clsx(!className && `character character-${chars[num]}`)}>{num}</span>
})

Character.displayName = "Character"

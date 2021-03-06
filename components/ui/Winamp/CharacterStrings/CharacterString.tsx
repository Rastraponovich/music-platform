import { memo } from "react"
import deburr from "lodash/deburr"

interface Props extends React.HTMLAttributes<HTMLSpanElement> {
    children: string | number
    className?: string
}

export const characterClassName = (char: string | number) =>
    `character-${deburr(char.toString()).toLowerCase().charCodeAt(0)}`

const CharacterString = ({ children: char, className, ...passThrough }: Props) => {
    return (
        <span
            {...passThrough}
            className={`${className || ""} character ${characterClassName(char)}`}
        >
            {char}
        </span>
    )
}

export default memo(CharacterString)

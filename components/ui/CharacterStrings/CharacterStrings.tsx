import React, { memo, FC, ReactNode } from "react"
import Character from "../Character/Character"
import CharacterString from "./CharacterString"

interface CharacterStringProps {
    children: ReactNode
}

const CharacterStrings = ({ children }: CharacterStringProps) => {
    const text = `${children}` || ""
    const chars = text.split("")
    return (
        <>
            {chars.map((character, index) => (
                <CharacterString key={index + character}>{character}</CharacterString>
            ))}
        </>
    )
}

export default memo(CharacterStrings)

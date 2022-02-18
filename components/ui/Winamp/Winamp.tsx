import React, { memo, FC } from "react"
import EQWindow from "./EQWindow/EQWindow"
import MainWindow from "./MainWindow/MainWindow"
import PlayListWindow from "./PlayListWindow/PlayListWindow"

interface WinampProps {}

const Winamp = () => {
    return (
        <>
            <MainWindow />
            <EQWindow />
            <PlayListWindow />
        </>
    )
}

export default Winamp

import React, { memo, FC, useRef, useEffect } from "react"

interface EQGraphProps {}

const GRAPH_HEIGHT = 19
const GRAPH_WIDTH = 113

const EQGraph: FC<EQGraphProps> = () => {
    const canvas = useRef<HTMLCanvasElement>(null)

    return (
        <canvas width={GRAPH_WIDTH} height={GRAPH_HEIGHT} className="mx-3.5" ref={canvas}></canvas>
    )
}

export default memo(EQGraph)

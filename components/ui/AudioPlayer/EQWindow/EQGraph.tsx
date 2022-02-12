import React, { memo, FC } from "react"

interface EQGraphProps {}

const GRAPH_HEIGHT = 19
const GRAPH_WIDTH = 113

const EQGraph: FC<EQGraphProps> = () => {
    return <canvas width={GRAPH_WIDTH} height={GRAPH_HEIGHT} className="mx-3.5"></canvas>
}

export default memo(EQGraph)

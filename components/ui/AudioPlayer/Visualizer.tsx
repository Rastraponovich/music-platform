import React, { memo, FC } from "react"

interface VisualizerProps {}

const Visualizer: FC<VisualizerProps> = () => {
    return <canvas id="visualizer" width="152" height="32" className="h-4 w-[76px]"></canvas>
}

export default Visualizer

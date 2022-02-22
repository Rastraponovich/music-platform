import { useState, useEffect } from "react"
import { useEvent, useStore } from "effector-react/scope"

import { balance, marqueInfo } from "@/features/media/winamp"

interface BalanceBarProps {}

const BalanceBar = () => {
    const currentBalance = useStore(balance.$currentBalance)
    const handleChangeBalance = useEvent(balance.changeBalance)

    const handleMouseDown = useEvent(marqueInfo.enabledMarqueInfo)
    const handleMouseUp = useEvent(marqueInfo.disabledMarqueInfo)

    const [currentStep, setCurrentStep] = useState(0)

    useEffect(() => {
        if (currentBalance === 0) return setCurrentStep(0)
        if (currentBalance < 0) return setCurrentStep(Math.ceil(currentBalance / 3.57) + 1)
        if (currentBalance > 0) return setCurrentStep(Math.ceil(currentBalance / -3.57) + 1)

        return () => setCurrentStep(0)
    }, [setCurrentStep, currentBalance])
    return (
        <input
            id="balance"
            type="range"
            min="-100"
            max="100"
            step="1"
            title="Balance"
            value={currentBalance}
            style={{ backgroundPosition: `0px ${currentStep * 15}px` }}
            className="slider-thumb  appearance-none"
            onChange={handleChangeBalance}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
        />
    )
}

export default BalanceBar

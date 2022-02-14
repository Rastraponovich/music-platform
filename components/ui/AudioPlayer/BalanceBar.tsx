import { balance } from "@/features/media/winamp"
import { useStore } from "effector-react"
import { useEvent } from "effector-react/scope"
import React, { memo, FC, useState, useEffect } from "react"

interface BalanceBarProps {}

const BalanceBar: FC<BalanceBarProps> = () => {
    const currentBalance = useStore(balance.$currentBalance)
    const handleChangeBalance = useEvent(balance.changeBalance)
    const resetBalance = useEvent(balance.resetBalance)

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
            onDoubleClick={resetBalance}
        />
    )
}

export default memo(BalanceBar)

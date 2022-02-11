import React, { memo, FC, useState, useEffect } from "react"

interface BalanceBarProps {}

const BalanceBar: FC<BalanceBarProps> = () => {
    const [balance, setBalance] = useState(0)

    const [currentStep, setCurrentStep] = useState(0)

    useEffect(() => {
        if (balance === 0) return setCurrentStep(0)
        if (balance < 0) return setCurrentStep(Math.ceil(balance / 3.57) + 1)
        if (balance > 0) return setCurrentStep(Math.ceil(balance / -3.57) + 1)

        return () => setCurrentStep(0)
    }, [setCurrentStep, balance])
    return (
        <input
            id="balance"
            type="range"
            min="-100"
            max="100"
            step="1"
            title="Balance"
            value={balance}
            style={{ backgroundPosition: `0px ${currentStep * 15}px` }}
            className="slider-thumb  appearance-none"
            onChange={(e) => setBalance(Number(e.target.value))}
            onDoubleClick={() => setBalance(0)}
        />
    )
}

export default memo(BalanceBar)

import { useEvent } from "effector-react/scope";

import { balance, marqueInfo } from "@/src/widgets/winamp/model";
import { selectors } from "../../model";
import { CURRENT_BALANCE_BG_OFFSET } from "../../lib";
import { useEffect, useRef } from "react";

/**
 * Компонент управляющий балансом трека в главном окне
 * @returns Component
 * @deprecated
 */
export const BalanceBar = () => {
  // eslint-disable-next-line lines-around-comment
  /**
   * текущее положение ползунка баланса
   */
  const currentStep = selectors.useCurrentBalanceStep();

  /**
   * значение баланса из WebAudioAPI
   */
  const currentBalance = selectors.useCurrentBalance();
  const handleChangeBalance = useEvent(balance.changeBalance);
  const handleMouseUp = useEvent(marqueInfo.disabledMarqueInfo);
  const handleMouseDown = useEvent(marqueInfo.enabledMarqueInfo);

  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    ref.current?.style.setProperty(
      "backgroundPosition",
      `0px ${currentStep * CURRENT_BALANCE_BG_OFFSET}px`,
    );
  }, [currentStep]);

  return (
    <input
      ref={ref}
      id="balance"
      type="range"
      min="-100"
      max="100"
      step="1"
      title="Balance"
      value={currentBalance}
      className="slider-thumb  appearance-none"
      onChange={handleChangeBalance}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    />
  );
};

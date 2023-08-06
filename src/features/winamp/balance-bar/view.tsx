import { useUnit } from "effector-react/scope";
import { useEffect, useRef } from "react";

import {
  $balance,
  $currentBalancePosition,
  balanceChanged,
  balancebarLifted,
  balancebarUplifted,
} from "./model";

import { CURRENT_BALANCE_BG_OFFSET } from "./constants";

/**
 * Компонент управляющий балансом трека в главном окне
 */
export const BalanceBar = () => {
  const [currentBalancePosition, balance] = useUnit([$currentBalancePosition, $balance]);

  const [handleChangeBalance, handleMouseDown, handleMouseUp] = useUnit([
    balanceChanged,
    balancebarLifted,
    balancebarUplifted,
  ]);

  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    ref.current?.style.setProperty(
      "backgroundPosition",
      `0px ${currentBalancePosition * CURRENT_BALANCE_BG_OFFSET}px`,
    );
  }, [currentBalancePosition]);

  return (
    <input
      ref={ref}
      id="balance"
      type="range"
      min="-100"
      max="100"
      step="1"
      title="Balance"
      value={balance}
      className="slider-thumb  appearance-none"
      onChange={handleChangeBalance}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    />
  );
};

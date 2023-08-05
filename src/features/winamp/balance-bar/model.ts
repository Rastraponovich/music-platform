import { balance, marqueInfo } from "@/src/widgets/winamp";
import { createEvent, sample } from "effector";
import type { ChangeEvent, MouseEvent } from "react";
import { $currentBalance, $currentBalanceStep } from "../main-window/model";

export const balanceChanged = createEvent<ChangeEvent<HTMLInputElement>>();
export const balancebarLifted = createEvent<MouseEvent<HTMLInputElement>>();
export const balancebarUplifted = createEvent<MouseEvent<HTMLInputElement>>();

export const $balance = $currentBalance.map((value) => value);
export const $currentBalancePosition = $currentBalanceStep.map((position) => position);

/**
 * when balance changed
 */
sample({
  clock: balanceChanged,
  target: balance.changeBalance,
});

/**
 * when balance bar lifted
 */
sample({
  clock: balancebarLifted,
  target: marqueInfo.enabledMarqueInfo,
});

/**
 * when balance bar uplifted
 */
sample({
  clock: balancebarUplifted,
  target: marqueInfo.disabledMarqueInfo,
});

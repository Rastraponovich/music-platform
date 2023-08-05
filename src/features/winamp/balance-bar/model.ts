import { createEvent, sample } from "effector";

import { balance, marqueInfo } from "@/src/widgets/winamp";
import { $currentBalance, $currentBalanceStep } from "../main-window/model";

import type { ChangeEvent, MouseEvent } from "react";

export const balanceChanged = createEvent<ChangeEvent<HTMLInputElement>>();
export const balancebarLifted = createEvent<MouseEvent<HTMLInputElement>>();
export const balancebarUplifted = createEvent<MouseEvent<HTMLInputElement>>();

export const $balance = $currentBalance.map((balance) => balance);
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

import { attach, createEvent, createStore, sample } from "effector";
import type { ChangeEvent, MouseEvent } from "react";

import type { MediaElement } from "@/features/music/types";
import { $Media, marqueInfo } from "@/src/widgets/winamp";
import { getSnapBalanceValue } from "@/utils/utils";

import { CURRENT_BALANCE_OFFSET } from "./constants";
import { getMarqueInfo } from "./utils";

// effects //

const changeBalanceFx = attach({
  source: $Media,
  async effect(media: Nullable<MediaElement>, event: ChangeEvent<HTMLInputElement>) {
    const value = getSnapBalanceValue(Number(event.target.value));

    if (media) {
      media!._balance.balance.value = value / 100;
    }

    return value;
  },
});

// events //
export const balanceChanged = createEvent<ChangeEvent<HTMLInputElement>>();
export const balancebarLifted = createEvent<MouseEvent<HTMLInputElement>>();
export const balancebarUplifted = createEvent<MouseEvent<HTMLInputElement>>();

// stores //
export const $balance = createStore<number>(0);
export const $currentBalancePosition = createStore(0);

//runtime //

$balance.on(changeBalanceFx.doneData, (_, newBalance) => newBalance);

$currentBalancePosition.on($balance, (_, currentBalance) => {
  switch (true) {
    case currentBalance < 0:
      return Math.ceil(currentBalance / CURRENT_BALANCE_OFFSET) + 1;

    case currentBalance > 0:
      return Math.ceil((currentBalance / CURRENT_BALANCE_OFFSET) * -1) + 1;

    default:
      return 0;
  }
});

/**
 * when balance changed set marque text
 */
marqueInfo.$winampMarqueInfo.on($balance, (_, balance) => getMarqueInfo(balance));

/**
 * when balance changed
 */
sample({
  clock: balanceChanged,
  target: changeBalanceFx,
});

/**
 * when balance bar lifted
 */
sample({
  clock: balancebarLifted,
  target: marqueInfo.enabledMarqueInfo,
});

/**
 * when balance bar lifted we need set the marque
 */
sample({
  clock: balancebarLifted,
  source: $balance,
  fn: (balance) => getMarqueInfo(balance),
  target: marqueInfo.$winampMarqueInfo,
});

/**
 * when balance bar uplifted
 */
sample({
  clock: balancebarUplifted,
  target: marqueInfo.disabledMarqueInfo,
});

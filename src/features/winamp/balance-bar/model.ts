import { attach, createEvent, createStore, sample } from "effector";
import { MediaElement } from "~/entity/songs";

import { getSnapBalanceValue } from "@/utils/utils";

import {
  $mediaElement,
  $winampMarqueInfo,
  disabledMarqueInfo,
  enabledMarqueInfo,
} from "~/widgets/winamp";

import { CURRENT_BALANCE_OFFSET } from "./constants";
import { getMarqueInfo } from "./utils";

// effects //

const changeBalanceFx = attach({
  source: $mediaElement,
  async effect(media: Nullable<MediaElement>, balance: string) {
    const value = getSnapBalanceValue(Number(balance));

    if (media) {
      media!._balance.balance.value = value / 100;
    }

    return value;
  },
});

// events //
export const balanceChanged = createEvent<string>();
export const balancebarLifted = createEvent();
export const balancebarUplifted = createEvent();

// stores //
export const $balance = createStore(0);
export const $currentBalancePosition = createStore(0);

//runtime //

$balance.on(changeBalanceFx.doneData, (_, newBalance) => newBalance);

$currentBalancePosition.on($balance, (_, newBalance) => {
  if (newBalance < 0) {
    return Math.ceil(newBalance / CURRENT_BALANCE_OFFSET) + 1;
  }

  if (newBalance > 0) {
    return Math.ceil((newBalance / CURRENT_BALANCE_OFFSET) * -1) + 1;
  }
  return 0;
});

/**
 * when balance changed set marque text
 */
$winampMarqueInfo.on($balance, (_, balance) => getMarqueInfo(balance));

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
  target: enabledMarqueInfo,
});

/**
 * when balance bar lifted we need set the marque
 */
sample({
  clock: balancebarLifted,
  source: $balance,
  fn: (balance) => getMarqueInfo(balance),
  target: $winampMarqueInfo,
});

/**
 * when balance bar uplifted
 */
sample({
  clock: balancebarUplifted,
  target: disabledMarqueInfo,
});

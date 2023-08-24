import { attach, createEvent, createStore, sample } from "effector";
import type { ChangeEvent, MouseEvent } from "react";
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

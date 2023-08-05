import { Store, createEffect, scopeBind, createEvent, createStore, sample } from "effector";

import { getClientScope } from "@/hooks/useScope";
import { getSnapBalanceValue } from "@/utils/utils";

import type { MediaElement } from "./types";
import type { ChangeEvent } from "react";
import type { Nullable } from "@/types";

export const createWinampBalanceFactory = ($Media: Store<Nullable<MediaElement>>) => {
  const changeBalanceFx = createEffect<
    { media: Nullable<MediaElement>; event: ChangeEvent<HTMLInputElement> },
    void
  >(({ media, event }) => {
    const value = getSnapBalanceValue(Number(event.target.value));
    const callSetBalanceScoped = scopeBind(setBalance, { scope: getClientScope()! });

    media!._balance.balance.value = value / 100;

    callSetBalanceScoped(value);
  });

  const setBalance = createEvent<number>();
  const changeBalance = createEvent<ChangeEvent<HTMLInputElement>>();

  const $currentBalance = createStore<number>(0);

  $currentBalance.on(setBalance, (_, newBalance) => newBalance);

  /**
   * change balance from ui
   */
  sample({
    clock: changeBalance,
    source: $Media,
    fn: (media, event) => ({ media, event }),
    target: changeBalanceFx,
  });

  return {
    $currentBalance,
    setBalance,
    changeBalance,
  };
};

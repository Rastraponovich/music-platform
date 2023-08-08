import { useUnit } from "effector-react";
import React from "react";

import PlayListWindow from "@/components/ui/Winamp/PlayListWindow/PlayListWindow";
import { WINAMP_STATE } from "@/features/music/constants";
import { EQWindow } from "@/src/features/winamp/eq-window";
import { MainWindow } from "@/src/features/winamp/main-window";
import { Hotkeys } from "@/src/shared/lib/hotkeys";
import { InitPlayer } from "@/src/shared/lib/init-player";
import { winampStates } from "@/src/widgets/winamp/model";

export const Winamp = () => {
  const state = useUnit(winampStates.$winampState);

  return (
    <>
      {state !== WINAMP_STATE.DESTROYED && (
        <InitPlayer>
          <Hotkeys>
            <MainWindow />
          </Hotkeys>
          <EQWindow />
          <PlayListWindow />
        </InitPlayer>
      )}
    </>
  );
};

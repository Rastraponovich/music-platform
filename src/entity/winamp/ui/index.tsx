import { useUnit } from "effector-react";

import PlayListWindow from "@/components/ui/Winamp/PlayListWindow/PlayListWindow";
import { WINAMP_STATE } from "@/features/music/constants";

import { winampStates } from "~/widgets/winamp/model";

import { EQWindow } from "~/features/winamp/equalizer";
import { MainWindow } from "~/features/winamp/main-window";

import { Hotkeys } from "~/shared/lib/hotkeys";
import { InitPlayer } from "~/shared/lib/init-player";

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

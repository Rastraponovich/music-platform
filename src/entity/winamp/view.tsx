import { useUnit } from "effector-react";

import { $winampState } from "~/widgets/winamp";

import { EQWindow } from "~/features/winamp/equalizer";
import { MainWindow } from "~/features/winamp/main-window";
import { PlayListWindow } from "~/features/winamp/playlist";

import { Hotkeys } from "~/shared/lib/hotkeys";
import { InitPlayer } from "~/shared/lib/init-player";

import { WINAMP_STATE } from "./constants";

export const Winamp = () => {
  const state = useUnit($winampState);

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

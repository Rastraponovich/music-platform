import clsx from "clsx";
import { useUnit } from "effector-react";

import { MEDIA_STATUS } from "@/features/media/constants";
import { WINAMP_STATE } from "@/features/music/constants";
import { winamp, winampStates } from "@/src/widgets/winamp/model";

import { WinampIcon } from "~/shared/ui/winamp-icon";

export const WinampLayoutButton = () => {
  const handleShowWinamp = useUnit(winamp.show);
  const mediaState = useUnit(winamp.$mediaStatus);
  const playerState = useUnit(winampStates.$winampState);

  const pulse = mediaState === MEDIA_STATUS.PLAYING && playerState === WINAMP_STATE.MINIMIZED;

  return (
    <button
      onClick={handleShowWinamp}
      className={clsx(
        "btn btn-ghost btn-square no-animation btn-md fixed bottom-8 right-8 z-50   rounded-full bg-[#3D4451] ",
        pulse && "animate-pulse",
        playerState !== WINAMP_STATE.MINIMIZED && "opacity-50",
      )}
    >
      <WinampIcon size="small" />
    </button>
  );
};

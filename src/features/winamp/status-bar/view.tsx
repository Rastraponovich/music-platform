import clsx from "clsx";
import { useUnit } from "effector-react";
import dynamic from "next/dynamic";
import { memo } from "react";
import { TimeMode } from "~/entity/winamp";

import { PLAYER_STATES } from "./constants";
import {
  $clutterbar,
  $currentTimeMode,
  $playerState,
  $timerValue,
  changedClutterBar,
  toggleTimeModeButtonClicked,
} from "./model";

const Visualizer = dynamic(() => import("../visualizer/view").then((mod) => mod.Visualizer), {
  ssr: false,
});

export const StatusBar = () => {
  const playerState = useUnit($playerState);

  return (
    <div className="webamp-status flex h-[42px] w-[93px]">
      <ClutterBar />
      <span
        id="play-pause"
        className={clsx(
          PLAYER_STATES[playerState],
          "cursor-winamp",
          "ml-2 mt-1.5 h-[9px] w-[9px] bg-no-repeat",
        )}
      />
      <span id="work-indicator" className=""></span>
      <TimerDisplay />
      <Visualizer />
    </div>
  );
};

const TimerDisplay = () => {
  const [playerState, timer, timeMode] = useUnit([$playerState, $timerValue, $currentTimeMode]);

  const handleSwitchTimeModeClicked = useUnit(toggleTimeModeButtonClicked);

  return (
    <div
      id="time"
      className={clsx(
        "player-countdown",
        playerState === "PAUSED" && "animate-w-blink",
        playerState === "STOPPED" && "hidden",

        "flex h-5 w-[66px] items-center ml-1.5",
      )}
      onClick={handleSwitchTimeModeClicked}
    >
      <Digit
        value={undefined}
        id="minus-sign"
        className={clsx("h-px w-[5px]", timeMode === TimeMode.ELAPSED && "opacity-0")}
      />
      <Digit id="minute-first-digit" value={timer.firstMinute} className="digit ml-[3px]" />
      <Digit id="minute-second-digit" value={timer.lastMinute} className="digit ml-[3px]" />
      <Digit id="second-first-digit" value={timer.firstSecond} className="digit ml-[9px]" />
      <Digit id="second-second-digit" value={timer.lastSecond} className="digit ml-[3px]" />
    </div>
  );
};

interface DigitProps {
  value: number | undefined;
  className: string;
  id: string;
}

const Digit = memo<DigitProps>(({ id, value, className }) => (
  <span id={id} className={clsx(className, value !== undefined && `digit-${value}`)} />
));

Digit.displayName = "Digit";

const ClutterBar = () => {
  const [clutterBar, handleChangedClutterBar] = useUnit([$clutterbar, changedClutterBar]);

  return (
    <div id="clutter-bar" className="flex h-[43px] w-2 flex-col justify-start pt-0.5">
      <div>
        <div className="handle h-full w-full">
          <ClutterBarButton id="o" onClick={handleChangedClutterBar} pressed={clutterBar.o} />
        </div>
      </div>
      <ClutterBarButton id="a" onClick={handleChangedClutterBar} pressed={clutterBar.a} />
      <ClutterBarButton id="i" onClick={handleChangedClutterBar} pressed={clutterBar.i} />
      <ClutterBarButton
        id="d"
        onClick={handleChangedClutterBar}
        pressed={clutterBar.d}
        title="Toggle Doublesize Mode"
      />
      <ClutterBarButton id="v" onClick={handleChangedClutterBar} pressed={clutterBar.v} />
    </div>
  );
};

interface ClutterBarButtonProps {
  id: string;
  onClick(id: string): void;
  pressed: boolean;
  title?: string;
}

const ClutterBarButton = memo<ClutterBarButtonProps>(({ onClick, id, pressed, title }) => {
  const handleButtonClicked = () => onClick(id);

  return (
    <span
      title={title}
      id={`button-${id}`}
      onClick={handleButtonClicked}
      className={clsx(pressed && "selected", "h-2 w-2")}
    />
  );
});

ClutterBarButton.displayName = "ClutterBarButton";

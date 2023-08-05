import clsx from "clsx";
import Link from "next/link";
import { memo } from "react";
import { useUnit } from "effector-react";

import {
  $eqVisible,
  $isPlaying,
  $loopIsOn,
  $shuffled,
  eqVisibilityToggled,
  loopToggled,
  nextTrackButtonClicked,
  pauseButtonClicked,
  playButtonClicked,
  prevTrackButtonClicked,
  shuffleToggled,
  stopButtonClicked,
} from "./model";

import { WinampButton } from "@/src/shared/ui/winamp/winamp-button";

interface ButtonProps {
  small?: boolean;
}

export const ControlsPanel = () => {
  return (
    <div className="actions flex items-center pl-4">
      <PrevTrackButton />
      <PlayButton />
      <PauseButton />
      <StopButton />
      <NextTrackButton />
      <OpenFileButton />

      <div className="shuffle-repeat flex w-[75px] cursor-winamp items-center">
        <ShuffleButton />
        <LoopButton />
      </div>
      <Link href="https://webamp.org/about">
        <a
          id="about"
          target="_blank"
          title="About"
          className="ml-[13px] h-[15px] w-[13px] cursor-pointer"
        ></a>
      </Link>
    </div>
  );
};

interface MiniActionsProps {
  bottom?: boolean;
}
export const MiniActions = memo<MiniActionsProps>(({ bottom = false }) => {
  return (
    <div className="flex items-center">
      <PrevTrackButton small />
      <PlayButton small />
      <PauseButton small />
      <StopButton small />
      <NextTrackButton small />
      <OpenFileButton small />
      {!bottom && <div id="position" className="mr-0.5 h-[7px] w-[17px]"></div>}
    </div>
  );
});

MiniActions.displayName = "MiniActions";

export const PrevTrackButton = ({ small = false }: ButtonProps) => {
  const handlePrevTrackButtonClicked = useUnit(prevTrackButtonClicked);

  return (
    <WinampButton
      small={small}
      id="previous"
      title="Previous Track"
      onClick={handlePrevTrackButtonClicked}
    />
  );
};

export const PlayButton = ({ small }: ButtonProps) => {
  const handlePlay = useUnit(playButtonClicked);

  return <WinampButton id="play" small={small} title="Play" onClick={handlePlay} />;
};

export const PauseButton = ({ small = false }: ButtonProps) => {
  const isPlaying = useUnit($isPlaying);
  const [handlePlay, handlePause] = useUnit([playButtonClicked, pauseButtonClicked]);

  return (
    <WinampButton
      id="pause"
      small={small}
      title="Pause"
      onClick={() => (isPlaying ? handlePause() : handlePlay())}
    />
  );
};

const StopButton = ({ small = false }: ButtonProps) => {
  const handleStop = useUnit(stopButtonClicked);

  return <WinampButton id="stop" title="Stop" onClick={handleStop} small={small} />;
};

const NextTrackButton = ({ small = false }: ButtonProps) => {
  const handleNextTrack = useUnit(nextTrackButtonClicked);

  return <WinampButton id="next" title="Next Track" onClick={handleNextTrack} small={small} />;
};

const OpenFileButton = ({ small = false }: ButtonProps) => {
  return (
    <WinampButton
      small={small}
      title="Open File(s)"
      id={small ? "next" : "eject"}
      className={clsx(small ? "mr-px" : "mx-1.5")}
    />
  );
};

const LoopButton = () => {
  const [loop, handleToogleLoop] = useUnit([$loopIsOn, loopToggled]);

  return (
    <WinampButton
      id="repeat"
      title="Toggle Repeat"
      onClick={handleToogleLoop}
      className={clsx(loop && "selected")}
    />
  );
};

const ShuffleButton = () => {
  const [handleToggleShuffle, shuffled] = useUnit([shuffleToggled, $shuffled]);

  return (
    <WinampButton
      id="shuffle"
      title="Toggle Shuffle"
      onClick={handleToggleShuffle}
      className={clsx(shuffled && "selected")}
    />
  );
};

export const ToggleEQButton = () => {
  const [handleToggleEqualizer, eqVisible] = useUnit([eqVisibilityToggled, $eqVisible]);

  return (
    <WinampButton
      active={eqVisible}
      id="equalizer-button"
      onClick={handleToggleEqualizer}
      title="Toggle Graphical Equalizer"
    />
  );
};

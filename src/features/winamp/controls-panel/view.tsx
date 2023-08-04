import { WinampButton } from "@/src/shared/ui/winamp/winamp-button";
import { useUnit } from "effector-react";
import Link from "next/link";
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
import { useCallback } from "react";
import clsx from "clsx";

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

export const PrevTrackButton = () => {
  const handlePrevTrackButtonClicked = useUnit(prevTrackButtonClicked);
  return (
    <WinampButton id="previous" title="Previous Track" onClick={handlePrevTrackButtonClicked} />
  );
};

export const PlayButton = () => {
  const handlePlay = useUnit(playButtonClicked);
  return <WinampButton id="play" title="Play" onClick={handlePlay} />;
};

export const PauseButton = () => {
  const isPlaying = useUnit($isPlaying);
  const [handlePlay, handlePause] = useUnit([playButtonClicked, pauseButtonClicked]);

  return (
    <WinampButton
      id="pause"
      title="Pause"
      onClick={() => (isPlaying ? handlePause() : handlePlay())}
    />
  );
};

const StopButton = () => {
  const handleStop = useUnit(stopButtonClicked);
  return <WinampButton id="stop" title="Stop" onClick={handleStop} />;
};

const NextTrackButton = () => {
  const handleNextTrack = useUnit(nextTrackButtonClicked);
  return <WinampButton id="next" title="Next Track" onClick={handleNextTrack} />;
};

const OpenFileButton = () => {
  return <WinampButton id="eject" title="Open File(s)" className="mx-1.5" />;
};

const LoopButton = () => {
  const handleToogleLoop = useUnit(loopToggled);
  const loop = useUnit($loopIsOn);

  return (
    <WinampButton
      id="repeat"
      className={clsx(loop && "selected")}
      title="Toggle Repeat"
      onClick={handleToogleLoop}
    />
  );
};

const ShuffleButton = () => {
  const [handleToggleShuffle, shuffled] = useUnit([shuffleToggled, $shuffled]);

  return (
    <WinampButton
      id="shuffle"
      className={clsx(shuffled && "selected")}
      title="Toggle Shuffle"
      onClick={handleToggleShuffle}
    />
  );
};

const ToggleEQButton = () => {
  const [handleToggleEqualizer, eqVisible] = useUnit([eqVisibilityToggled, $eqVisible]);
  return (
    <WinampButton
      id="equalizer-button"
      title="Toggle Graphical Equalizer"
      onClick={handleToggleEqualizer}
      active={eqVisible}
    />
  );
};

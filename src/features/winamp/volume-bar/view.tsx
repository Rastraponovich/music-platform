import { useUnit } from "effector-react/scope";

import {
  $currentVolumePosition,
  $volume,
  volumeChanged,
  volumebarLifted,
  volumebarUplifted,
} from "./model";

import { VOLUME_BG_OFFSET } from "./constants";

export const VolumeBar = () => {
  const [volume, currentVolumePosition] = useUnit([$volume, $currentVolumePosition]);

  const [handleChangeVolume, handleMouseDown, handleMouseUp] = useUnit([
    volumeChanged,
    volumebarLifted,
    volumebarUplifted,
  ]);

  return (
    <div
      id="volume"
      style={{
        backgroundPosition: `0px -${
          currentVolumePosition! * VOLUME_BG_OFFSET - VOLUME_BG_OFFSET
        }px`,
      }}
    >
      <input
        type="range"
        min="0"
        max="100"
        step="1"
        title="Volume Bar"
        value={volume}
        onChange={handleChangeVolume}
        className="slider-thumb  appearance-none"
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
      />
    </div>
  );
};

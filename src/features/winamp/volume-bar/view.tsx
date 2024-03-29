import { useUnit } from "effector-react/scope";

import { VOLUME_BG_OFFSET } from "./constants";
import {
  $currentVolume,
  $currentVolumePosition,
  volumeChanged,
  volumebarLifted,
  volumebarUplifted,
} from "./model";

export const VolumeBar = () => {
  const [volume, currentVolumePosition] = useUnit([$currentVolume, $currentVolumePosition]);

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
        onChange={(e) => handleChangeVolume(e.target.value)}
        className="slider-thumb  appearance-none"
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
      />
    </div>
  );
};

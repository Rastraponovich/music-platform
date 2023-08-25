import clsx from "clsx";
import { useUnit } from "effector-react";
import { MouseEvent, memo, useEffect, useMemo, useRef, useState } from "react";
import type { Track } from "~/entity/songs";

import { Character } from "~/shared/ui/winamp/character-strings";
import { CharacterStrings } from "~/shared/ui/winamp/character-strings";

import { MARQUEE_MAX_LENGTH, MINUTE, SEPARATOR } from "./constants";
import { $enabledMarque, $marqueInfoText } from "./model";
import { isLong } from "./utils";

interface KBPSProps {
  bitrate: number;
}

export const KBPS = memo<KBPSProps>(({ bitrate }) => {
  return (
    <div id="kbps" className="text-opacity-0">
      <Character num={String(bitrate).charAt(0)} />
      <Character num={String(bitrate).charAt(1)} />
      <Character num={String(bitrate).charAt(2)} />
    </div>
  );
});
KBPS.displayName = "KBPS";

interface KHZProps {
  sampleRate: number;
}

export const KHZ = memo<KHZProps>(({ sampleRate }) => {
  return (
    <div id="khz" className="text-opacity-0">
      <Character num={String(sampleRate).charAt(0)} />
      <Character num={String(sampleRate).charAt(1)} />
    </div>
  );
});
KHZ.displayName = "KHZ";

interface MonoStereoProps {
  numberOfChannels: number;
}

export const MonoStereo = memo<MonoStereoProps>(({ numberOfChannels }) => {
  return (
    <div className="mono-stereo">
      <div id="stereo" className={clsx(numberOfChannels === 2 && "selected")}></div>
      <div id="mono" className={clsx(numberOfChannels !== 2 && "selected")}></div>
    </div>
  );
});

MonoStereo.displayName = "MonoStereo";

interface MediaInfoTrackProps {
  currentTrack: Track;
  currentId: number;
}

export const Ticker = memo<MediaInfoTrackProps>(({ currentTrack, currentId }) => {
  const timerId = useRef<unknown>(null);
  const ref = useRef<Nullable<HTMLDivElement>>(null);

  const [pos, setpos] = useState(0);
  const [diff, setDiff] = useState(0);

  const [enabledMarque, marqueInfoText] = useUnit([$enabledMarque, $marqueInfoText]);

  const [track, setTrack] = useState(SEPARATOR);
  const [allowDragging, setAllowDragging] = useState(false);

  const min = useMemo(
    () => Math.floor(currentTrack?.metaData.format.duration / MINUTE),
    [currentTrack],
  );
  const sec = useMemo(
    () => Math.floor(currentTrack?.metaData.format.duration % MINUTE),
    [currentTrack],
  );

  useEffect(() => {
    setpos(0);
  }, [currentTrack]);

  useEffect(() => {
    const total = `(${min < 10 ? `0${min}` : min}:${sec < 10 ? `0${sec}` : sec})`;
    const text = `${currentId !== null && currentId + 1}. ${currentTrack?.artist} - ${
      currentTrack.name
    }   ${total}`;

    setTrack(isLong(text) ? `${text}${SEPARATOR}${text}` : text.padEnd(MARQUEE_MAX_LENGTH, " "));

    return () => setpos(1);
  }, [currentId, min, sec, currentTrack?.artist, currentTrack?.name]);

  useEffect(() => {
    timerId.current = setInterval(() => {
      if (!allowDragging && track.length > MARQUEE_MAX_LENGTH) {
        if (pos <= -track.length * 2.6) return setpos(0);
        setpos(pos - 5);
      }
    }, 220);
    return () => clearInterval(timerId.current as number);
  }, [pos, currentId, allowDragging, track.length]);

  const handleDragStart = (e: MouseEvent<HTMLElement>) => {
    e.preventDefault();
    setDiff(e.screenX);
    setAllowDragging(true);
  };
  const handleDragging = (e: MouseEvent<HTMLElement>) => {
    if (allowDragging) {
      setpos(e.screenX - diff);
    }
  };
  const handleDragEnd = (_: MouseEvent<HTMLElement>) => {
    setAllowDragging(false);
  };

  return (
    <div
      id="marquee"
      className="text relative"
      title="Song Title"
      onMouseDown={handleDragStart}
      onMouseMove={handleDragging}
      onMouseUp={handleDragEnd}
      onMouseLeave={handleDragEnd}
    >
      {enabledMarque ? (
        <div className="whitespace-nowrap text-[8px]  text-[#00FF00] will-change-transform">
          <CharacterStrings>{marqueInfoText}</CharacterStrings>
        </div>
      ) : (
        <div
          className="whitespace-nowrap text-[8px]  text-[#00FF00] will-change-transform"
          ref={ref}
          style={{
            transform: `translateX(${pos}px)`,
          }}
        >
          <CharacterStrings>{track}</CharacterStrings>
        </div>
      )}
    </div>
  );
});

Ticker.displayName = "MediaInfoTrack";

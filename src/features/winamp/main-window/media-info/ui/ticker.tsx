import React, { MouseEvent, memo, useEffect, useMemo, useRef, useState } from "react";

import type { Track } from "@/features/music/types";

import { CharacterStrings } from "~/shared/ui/winamp/character-strings";

import { MARQUEE_MAX_LENGTH, MINUTE, SEPARATOR, isLong } from "../lib";
import { selectors } from "../model";

interface MediaInfoTrackProps {
  currentTrack: Track;
  currentId: number;
}

export const Ticker = memo(({ currentTrack, currentId }: MediaInfoTrackProps) => {
  const timerId = useRef<unknown>(null);
  const ref = useRef<Nullable<HTMLDivElement>>(null);

  const [pos, setpos] = useState(0);
  const [diff, setDiff] = useState(0);

  const enabledMarque = selectors.useEnabledMarque();
  const marqueInfoText = selectors.useMarqueInfoText();

  const [track, setTrack] = useState(SEPARATOR);
  const [allowDragging, setAllowDragging] = useState<boolean>(false);

  const min = useMemo(
    () => Math.floor(currentTrack.metaData.format.duration / MINUTE),
    [currentTrack],
  );
  const sec = useMemo(
    () => Math.floor(currentTrack.metaData.format.duration % MINUTE),
    [currentTrack],
  );

  useEffect(() => {
    setpos(0);
  }, [currentTrack]);

  useEffect(() => {
    const total = `(${min < 10 ? `0${min}` : min}:${sec < 10 ? `0${sec}` : sec})`;
    const text = `${currentId !== null && currentId + 1}. ${currentTrack.artist} - ${
      currentTrack.name
    }   ${total}`;

    setTrack(isLong(text) ? `${text}${SEPARATOR}${text}` : text.padEnd(MARQUEE_MAX_LENGTH, " "));

    return () => setpos(1);
  }, [currentId, min, sec, currentTrack.artist, currentTrack.name]);

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

import { MARQUEE_MAX_LENGTH } from "./constants";

export const isLong = (text: string): boolean => text.length >= MARQUEE_MAX_LENGTH;

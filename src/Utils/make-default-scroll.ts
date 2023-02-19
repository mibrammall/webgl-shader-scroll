import { Scroll } from "../types";

export function makeDefaultScroll(): Scroll {
  return {
    height: 0,
    limit: 0,
    hard: 0,
    soft: 0,
    ease: 0.05,
    normalized: 0,
    running: false,
  };
}

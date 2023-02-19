import { Settings } from "../types";

export function makeDefaultSettings(): Settings {
  return {
    uFrequency: {
      start: 0,
      end: 4,
    },
    uAmplitude: {
      start: 4,
      end: 4,
    },
    uDensity: {
      start: 1,
      end: 1,
    },
    uStrength: {
      start: 0,
      end: 1.1,
    },
    // fragment
    uDeepPurple: {
      // max 1
      start: 1,
      end: 0,
    },
    uOpacity: {
      // max 1
      start: 0.1,
      end: 0.66,
    },
  };
}

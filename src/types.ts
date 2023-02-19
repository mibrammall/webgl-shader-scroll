export interface Scroll {
  ease: number;
  hard: number;
  height: number;
  limit: number;
  normalized: number;
  running: boolean;
  soft: number;
}

export interface Setting {
  start: number;
  end: number;
}

export interface Settings {
  uFrequency: Setting;
  uAmplitude: Setting;
  uDensity: Setting;
  uStrength: Setting;
  uDeepPurple: Setting;
  uOpacity: Setting;
}

export interface ViewPort {
  width: number;
  height: number;
}

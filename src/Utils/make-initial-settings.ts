import { IUniform } from "three";
import { Settings } from "../types";

export function makeInitialUniforms(settings: Settings) {
  const keys = Object.keys(settings);

  const uniforms: { [key: string]: IUniform<any> } = {};

  keys.forEach((key) => {
    /** @ts-ignore */
    uniforms[key] = { value: (settings[key] as Setting).start };
  });

  return uniforms;
}

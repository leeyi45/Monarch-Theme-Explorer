import {
  hc_black,
  hc_light,
  vs as vs_light,
  vs_dark
} from 'monaco-editor/editor/standalone/common/themes.js';

export { vs_dark, vs_light, hc_black, hc_light };

export const themes = {
  'vs-dark': vs_dark,
  'vs-light': vs_light,
  'hc-black': hc_black,
  'hc-light': hc_light
} as const;

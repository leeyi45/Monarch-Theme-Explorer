// Monaco editor doesn't expose types for the themes, so we need to
// create our own declaration file for them

declare module 'monaco-editor/editor/standalone/common/themes.js' {
  import type { editor } from 'monaco-editor';

  export const vs_dark: editor.IStandaloneThemeData;
  export const vs: editor.IStandaloneThemeData;
  export const hc_black: editor.IStandaloneThemeData;
  export const hc_light: editor.IStandaloneThemeData;
}

import type { editor } from 'monaco-editor';

/**
 * `monaco-editor` theme for Source Academy applications
 */
export const editorTheme = {
  base: 'vs-dark',
  inherit: true,
  rules: [
    { token: 'comment', foreground: '0088FF', fontStyle: 'italic' },
    { token: 'constant', foreground: 'FF628C' },
    { token: 'keyword', foreground: 'FF9D00' },
    { token: 'keyword.illegal', foreground: 'FF0000' },
    { token: 'number', foreground: 'FF628C' },
    { token: 'operator', foreground: 'FF9D00' },
    { token: 'operator.illegal', foreground: 'FF0000' },
    { token: 'string', foreground: 'FF628C' },
    { token: 'type', foreground: 'FFEE80' },
    { token: 'variable', foreground: 'CCCCCC' },
  ],
  colors: {}
} satisfies editor.IStandaloneThemeData;

export const defaultEditorConfig = {
  folding: false,
  glyphMargin: false,
  fontFamily: '\'Inconsolata\', \'Consolas\', monospace',
  fontSize: 17,
  hover: {
    enabled: 'off'
  },
  lineHeight: 17,
  lineNumbersMinChars: 4,
  minimap: {
    enabled: false
  },
  renderLineHighlight: 'gutter',
  scrollbar: {
    useShadows: false
  },
  scrollBeyondLastLine: false
} satisfies editor.IEditorOptions;

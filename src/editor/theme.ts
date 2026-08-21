import type { editor } from 'monaco-editor';

export const aceSourceColors = {
  activeLineBackground: '#00000059',
  autocompleteActiveLineBackground: '#495A6B',
  autocompleteBackground: '#2C3E50',
  bracketMatchBackground: '#009900',
  cursor: '#FFFFFF',
  // These are the visible Ace editor surface colors from _workspace.scss.
  editorBackground: '#2C3E50',
  foreground: '#FFFFFF',
  gutterBackground: '#34495E',
  invisibleForeground: '#FFFFFF26',
  lineNumberForeground: '#8091A0',
  printMarginBackground: '#555555',
  selectionBackground: '#B36539BF',
  widgetBorder: '#555555',
} as const;

/**
 * `monaco-editor` theme for Source Academy applications
 */
export const sourceAcademyEditorTheme = {
  base: 'vs-dark',
  inherit: true,
  rules: [
    { token: '', foreground: aceSourceColors.foreground.slice(1) },
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
  colors: {
    'editor.background': aceSourceColors.editorBackground,
    'editor.foreground': aceSourceColors.foreground,
    'editorCursor.foreground': aceSourceColors.cursor,
    'editorGutter.background': aceSourceColors.gutterBackground,
    'editorLineNumber.foreground': aceSourceColors.lineNumberForeground,
    'editorLineNumber.activeForeground': '#C8E4FD',
    'editor.selectionBackground': aceSourceColors.selectionBackground,
    'editor.wordHighlightBorder': aceSourceColors.selectionBackground,
    'editor.lineHighlightBackground': aceSourceColors.activeLineBackground,
    'editor.lineHighlightBorder': '#00000000',
    'editorRuler.foreground': aceSourceColors.printMarginBackground,
    'editorWhitespace.foreground': aceSourceColors.invisibleForeground,
    'editorIndentGuide.background1': '#334A60',
    'editorIndentGuide.activeBackground1': aceSourceColors.lineNumberForeground,
    'editorBracketMatch.background': aceSourceColors.bracketMatchBackground,
    'editorBracketMatch.border': aceSourceColors.bracketMatchBackground,
    'editorWidget.background': aceSourceColors.autocompleteBackground,
    'editorWidget.border': aceSourceColors.widgetBorder,
    'editorHoverWidget.background': aceSourceColors.autocompleteActiveLineBackground,
    'editorHoverWidget.border': aceSourceColors.widgetBorder,
    'editorSuggestWidget.background': aceSourceColors.autocompleteBackground,
    'editorSuggestWidget.border': aceSourceColors.widgetBorder,
    'editorSuggestWidget.foreground': aceSourceColors.foreground,
    'editorSuggestWidget.highlightForeground': '#FF9D00',
    'editorSuggestWidget.selectedBackground': aceSourceColors.autocompleteActiveLineBackground,
    'editorSuggestWidget.selectedForeground': aceSourceColors.foreground,
    'editorSuggestWidget.focusHighlightForeground': '#FF9D00',
    'editorSuggestWidgetStatus.foreground': '#CED9E0',
    'scrollbarSlider.background': '#6B839A66',
    'scrollbarSlider.hoverBackground': '#6B839A99',
    'scrollbarSlider.activeBackground': '#6B839ACC',
  },
} satisfies editor.IStandaloneThemeData;

/**
 * Default `monaco-editor` options for Source Academy applications
 */
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

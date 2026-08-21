import MonacoEditor from '@monaco-editor/react';
import type { editor } from 'monaco-editor';
import './setupMonaco';
import { forwardRef } from 'react';

export interface EditorProps {
  onValueChange?: (newValue: string) => void;

  defaultValue?: string;
  language?: string;
  theme?: string;
}

const Editor = forwardRef<editor.IStandaloneCodeEditor | null, EditorProps>((props, ref) => {
  return <MonacoEditor
    options={{
      automaticLayout: true,
      glyphMargin: false,
      minimap: {
        enabled: false
      },
      scrollbar: {
        useShadows: false
      },
      scrollBeyondLastLine: false,
    }}
    defaultValue={props.defaultValue}
    height='100vh'
    language={props.language}
    theme={props.theme ?? 'vs-dark'}
    onChange={newValue => props.onValueChange?.(newValue ?? '')}
    onMount={editor => {
      if (typeof ref === 'function') {
        ref(editor);
      } else if (ref) {
        ref.current = editor;
      }
    }}
  />;
});

export default Editor;

import { loader } from '@monaco-editor/react';
import * as monaco from 'monaco-editor';
import { languages } from '../languages';
import { sourceAcademyEditorTheme } from './theme';

type MonacoEnvironmentGlobal = typeof globalThis & {
  MonacoEnvironment?: {
    getWorker: (_moduleId: string, label: string) => Worker;
  };
};

(self as MonacoEnvironmentGlobal).MonacoEnvironment = {
  getWorker(_, label) {
    if (label === 'json') {
      return new Worker(new URL('monaco-editor/esm/vs/language/json/json.worker', import.meta.url), { type: 'module' });
    }
    if (label === 'typescript' || label === 'javascript') {
      return new Worker(new URL('monaco-editor/esm/vs/language/typescript/ts.worker', import.meta.url), { type: 'module' });
    }
    return new Worker(new URL('monaco-editor/esm/vs/editor/editor.worker', import.meta.url), {
      type: 'module',
    });
  },
};

languages.forEach(({ id, monarchGrammar }) => {
  if (typeof monarchGrammar !== 'string') {
    monaco.languages.register({ id });
    monaco.languages.setMonarchTokensProvider(id, monarchGrammar);
  }
});

monaco.typescript.typescriptDefaults.setEagerModelSync(true);

monaco.editor.defineTheme('source', sourceAcademyEditorTheme);

loader.config({ monaco });

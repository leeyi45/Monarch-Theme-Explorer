import { loader } from '@monaco-editor/react';
import * as monaco from 'monaco-editor';

import { languages } from '../languages';

import * as themes from './theme';

type MonacoEnvironmentGlobal = typeof globalThis & {
  MonacoEnvironment?: {
    getWorker: (_moduleId: string, label: string) => Worker;
  };
};

(self as MonacoEnvironmentGlobal).MonacoEnvironment = {
  getWorker(_, label) {
    if (label === 'json') {
      return new Worker(new URL('../../node_modules/monaco-editor/esm/vs/language/json/json.worker.js', import.meta.url), {
        type: 'module',
      });
    }
    if (label === 'typescript' || label === 'javascript') {
      return new Worker(new URL('../../node_modules/monaco-editor/esm/vs/language/typescript/ts.worker.js', import.meta.url), {
        type: 'module',
      });
    }
    return new Worker(new URL('../../node_modules/monaco-editor/esm/vs/editor/editor.worker.js', import.meta.url), {
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
monaco.typescript.typescriptDefaults.setDiagnosticsOptions({
  diagnosticCodesToIgnore: [1108]
});

Object.entries(themes).forEach(([themeName, theme]) => {
  themeName = themeName.replaceAll('_', '-');
  try {
    monaco.editor.defineTheme(`${themeName}-custom`, theme);
  } catch (error) {
    console.error(`Error while defining ${themeName}-custom`, error);
  }
});

loader.config({ monaco });

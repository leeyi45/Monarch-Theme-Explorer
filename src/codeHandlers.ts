import { debounce, limitAsync } from 'es-toolkit';
import * as monaco from 'monaco-editor';
import type { ILanguageDefinition } from './languages/types';

function flattenMessageText(messageText: monaco.typescript.Diagnostic['messageText']): string {
  if (typeof messageText === 'string') return messageText;
  const parts: string[] = [];
  (function walk(node: any) {
    if (!node) return;
    if (typeof node.messageText === 'string') parts.push(node.messageText);
    if (Array.isArray(node.next)) node.next.forEach(walk);
  })(messageText);
  return parts.join(' ').trim();
}

function formatDiag(diag: monaco.typescript.Diagnostic, model?: monaco.editor.ITextModel) {
  const msg = flattenMessageText(diag.messageText);
  const code = diag.code ? `TS${diag.code}` : 'TS';
  if (model && typeof diag.start === 'number') {
    const pos = model.getPositionAt(diag.start);
    return `${code} ${pos.lineNumber}:${pos.column} — ${msg}`;
  }
  return `${code} — ${msg}`;
}

/**
 * Get the Javascript text from the Monarch Editor and compile it into Javascript.
 */
export const getEditorText = limitAsync(
  async (editor: monaco.editor.IStandaloneCodeEditor): Promise<[string | null, string | null] | undefined> => {
    const model = editor.getModel();
    if (!model) return undefined;;

    const getWorker = await monaco.typescript.getTypeScriptWorker();
    const worker = await getWorker(model.uri);
    const modelUri = model.uri.toString();

    const [
      emitOutput,
      semanticDiagnostics,
      syntacticDiagnostics
    ] = await Promise.all([
      worker.getEmitOutput(modelUri),
      worker.getSemanticDiagnostics(modelUri),
      worker.getSyntacticDiagnostics(modelUri)
    ]);

    const allDiagnostics = [...semanticDiagnostics, ...syntacticDiagnostics]
      .filter(diagnostic => diagnostic.category === 1 && diagnostic.code !== 1108);

    const diagStr = allDiagnostics.length === 0
      ? null
      : allDiagnostics.map(each => formatDiag(each, model)).join('\n');

    if (!emitOutput.outputFiles || emitOutput.outputFiles.length === 0) return [null, diagStr];
    return [emitOutput.outputFiles[0].text, diagStr];
  },
  1
);

/**
 * Convert the raw Javascript text from the Monarch Editor into a grammar object
 */
export const updateMonarchGrammar = debounce(
  (jsText: string, languageDef: ILanguageDefinition, setError: (error: string | null) => void) => {
    if (jsText === undefined) return;

    try {
      const newGrammar = new Function(jsText)();
      if (typeof newGrammar === 'object') {
        monaco.languages.setMonarchTokensProvider(languageDef.id, newGrammar);
        setError(null);
      } else {
        setError('Monarch Grammar must be an object');
      }
    } catch (error: any) {
      setError(error.toString());
    }
  },
  200
);

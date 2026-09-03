import * as monaco from 'monaco-editor';
import { describe, expect, it, vi } from 'vitest';
import { getEditorText, updateMonarchGrammar } from '../codeHandlers';
import { stringifyMonarchGrammar } from '../languages';
import { source1Language } from '../languages/source';

vi.mock(import('es-toolkit'), async importOriginal => {
  const original = await importOriginal();

  return {
    ...original,
    debounce: x => x as any,
    limitAsync: x => x
  };
});

const mockedSetMonarchTokensProvider = vi.spyOn(monaco.languages, 'setMonarchTokensProvider')
  .mockImplementation(() => { return {} as any; });

describe('updateMonarchGrammar', () => {
  it('works', () => {
    const validGrammar = source1Language.monarchGrammar;
    const jsText = 'return ' + stringifyMonarchGrammar(validGrammar);

    const mockedSetError = vi.fn();
    expect(() => updateMonarchGrammar(jsText, source1Language, mockedSetError)).not.toThrow();
    expect(mockedSetError).toHaveBeenCalledExactlyOnceWith(null);
    expect(mockedSetMonarchTokensProvider).toHaveBeenCalledExactlyOnceWith(source1Language.id, validGrammar);
  });

  it('sets an error when the grammar is not an object', () => {
    const jsText = 'return 123;';

    const mockedSetError = vi.fn();
    expect(() => updateMonarchGrammar(jsText, source1Language, mockedSetError)).not.toThrow();
    expect(mockedSetError).toHaveBeenCalledExactlyOnceWith('Monarch Grammar must be an object');
    expect(mockedSetMonarchTokensProvider).not.toHaveBeenCalled();
  });

  it('sets an error when there was an error compiling the grammar', () => {
    const jsText = 'return { invalid: ; }';

    const mockedSetError = vi.fn();
    expect(() => updateMonarchGrammar(jsText, source1Language, mockedSetError)).not.toThrow();
    expect(mockedSetError).toHaveBeenCalledExactlyOnceWith(expect.stringMatching(/SyntaxError: Unexpected token ';'/));
    expect(mockedSetMonarchTokensProvider).not.toHaveBeenCalled();
  });
});

describe('getEditorText', () => {
  const mockedModel: monaco.editor.ITextModel = {
    uri: { toString: () => 'file:///test.ts' },
    getPositionAt: (offset: number) => ({ lineNumber: 1, column: offset + 1 }),
  } as any;

  const mockEditor: monaco.editor.IStandaloneCodeEditor = {
    getModel: () => mockedModel
  } as any;

  function mockWorkerResponse(
    text: string | null,
    semanticDiagnostics: monaco.typescript.Diagnostic[] = [],
    syntacticDiagnostics: monaco.typescript.Diagnostic[] = []
  ) {
    const mockedWorker: monaco.typescript.TypeScriptWorker = {
      getEmitOutput: () => Promise.resolve({
        emitSkipped: false,
        outputFiles: text === null ? [] : [{ name: 'file.js', text }]
      }),
      getSemanticDiagnostics: () => Promise.resolve(semanticDiagnostics),
      getSyntacticDiagnostics: () => Promise.resolve(syntacticDiagnostics)
    } as any;

    vi.spyOn(monaco.typescript, 'getTypeScriptWorker').mockResolvedValueOnce(async () => mockedWorker);
  }

  it('returns the compiled text and no diagnostics when there are no errors', async () => {
    const compiledText = 'console.log("Hello, world!");';
    mockWorkerResponse(compiledText);

    await expect(getEditorText(mockEditor)).resolves.toEqual([compiledText, null]);
    expect(monaco.typescript.getTypeScriptWorker).toHaveBeenCalledOnce();
  });

  it('returns the compiled text and diagnostics when there are errors', async () => {
    const compiledText = 'console.log("Hello, world!");';
    const diagnostics: monaco.typescript.Diagnostic[] = [
      {
        code: 1001,
        category: 1,
        messageText: 'Test error',
        start: 0,
        length: 10,
        file: { fileName: 'test.ts' }
      }
    ];
    mockWorkerResponse(compiledText, diagnostics);

    await expect(getEditorText(mockEditor)).resolves.toEqual([compiledText, expect.stringMatching(/Test error/)]);
    expect(monaco.typescript.getTypeScriptWorker).toHaveBeenCalledOnce();
  });

  it('returns null for compiled text when emit output is empty', async () => {
    mockWorkerResponse(null);

    await expect(getEditorText(mockEditor)).resolves.toEqual([null, null]);
    expect(monaco.typescript.getTypeScriptWorker).toHaveBeenCalledOnce();
  });
});

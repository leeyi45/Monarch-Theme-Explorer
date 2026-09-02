import * as monaco from 'monaco-editor';
import { describe, expect, it, vi } from 'vitest';
import { updateMonarchGrammar } from '../codeHandlers';
import { stringifyMonarchGrammar } from '../languages';
import { source1Language } from '../languages/source';

vi.mock(import('es-toolkit'), async importOriginal => {
  const original = await importOriginal();

  return {
    ...original,
    debounce: x => x as any,
    limitAsync: x => x as any
  };
});

const mockedSetMonarchTokensProvider = vi.spyOn(monaco.languages, 'setMonarchTokensProvider')
  .mockImplementation(() => { return {} as any; });

describe(updateMonarchGrammar, () => {
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
